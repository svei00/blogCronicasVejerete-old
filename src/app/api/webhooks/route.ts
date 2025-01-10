import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { clerkClient, WebhookEvent } from '@clerk/nextjs/server';
import { createOrUpdateUser, deleteUser } from '@/lib/actions/user';

export async function POST(req: Request): Promise<Response> {
  // Increase the response timeout
  req.signal.addEventListener('abort', () => {
    console.log('Request was aborted');
  });

  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    });
  }

  let payload;
  try {
    payload = await req.json();
  } catch (error) {
    console.error('Error parsing request body:', error);
    return new Response('Error parsing request body', { status: 400 });
  }

  const body = JSON.stringify(payload);
  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification error', {
      status: 400,
    });
  }

  // Log payload for debugging
  const { id } = evt?.data ?? {};
  const eventType = evt?.type;
  console.log(`Processing webhook: ID ${id}, Type ${eventType}, Timestamp: ${new Date().toISOString()}`);

  // Handle user events
  if (eventType === 'user.created' || eventType === 'user.updated') {
    const {
      id,
      first_name,
      last_name,
      image_url,
      email_addresses,
      username,
    } = evt?.data ?? {};

    if (!id) {
      console.error('Error: User ID is undefined in webhook payload');
      return new Response('Error: User ID is undefined', {
        status: 400,
      });
    }

    try {
      // Set a timeout for the database operation
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database operation timed out')), 8000)
      );

      const userPromise = createOrUpdateUser(
        id,
        first_name ?? '',
        last_name ?? '',
        image_url ?? '',
        email_addresses,
        username ?? ''
      );

      // Race between the database operation and the timeout
      const user = await Promise.race([userPromise, timeoutPromise]);

      if (user && eventType === 'user.created') {
        try {
          const clerk = await clerkClient();
          await clerk.users.updateUserMetadata(id, {
            publicMetadata: {
              userMongoId: user._id,
              isAdmin: user.isAdmin,
            },
          });
          console.log(`Successfully updated Clerk metadata for user ${id}`);
        } catch (error) {
          console.error('Error updating Clerk metadata:', error);
        }
      }

      console.log(`Successfully processed user ${id} for event ${eventType}`);
      return new Response('User processed successfully', { status: 200 });
    } catch (error) {
      console.error(`Error processing user ${id}:`, error);
      // Send a 202 instead of 400 to acknowledge receipt of the webhook
      return new Response('User processing queued', { status: 202 });
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt?.data ?? {};
    if (!id) {
      console.error('Error: User ID is undefined in delete webhook');
      return new Response('Error: User ID is undefined', {
        status: 400,
      });
    }

    try {
      await deleteUser(id);
      console.log(`Successfully deleted user ${id}`);
      return new Response('User deleted successfully', { status: 200 });
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      return new Response('User deletion queued', { status: 202 });
    }
  }

  return new Response('Webhook received', { status: 200 });
}