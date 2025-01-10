import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { clerkClient, WebhookEvent } from '@clerk/nextjs/server'; 
import { createOrUpdateUser, deleteUser } from '@/lib/actions/user';

export async function POST(req: Request): Promise<Response> {
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

  // Get body
  const payload = await req.json();
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
  console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
  console.log('Webhook payload:', body);

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

    // Type check for required id
    if (!id) {
      return new Response('Error: User ID is undefined', {
        status: 400,
      });
    }

    try {
      const user = await createOrUpdateUser(
        id,
        first_name ?? '',
        last_name ?? '',
        image_url ?? '',
        email_addresses,
        username ?? ''
      );

      if (user && eventType === 'user.created') {
        try {
          // Initialize Clerk client
          const clerk = await clerkClient();
          
          // Update user metadata
          await clerk.users.updateUserMetadata(id, {
            publicMetadata: {
              userMongoId: user._id,
              isAdmin: user.isAdmin,
            },
          });
        } catch (error) {
          console.error('Error Updating User Metadata:', error);
          // Don't return here as we still want to send a success response
          // The user was created successfully, even if metadata update failed
        }
      }

      return new Response('User processed successfully', { status: 200 });
    } catch (error) {
      console.error('Error Creating or Updating User:', error);
      return new Response('Error: Could not create or update user', {
        status: 400,
      });
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt?.data ?? {};
    if (!id) {
      return new Response('Error: User ID is undefined', {
        status: 400,
      });
    }

    try {
      await deleteUser(id);
      return new Response('User deleted successfully', { status: 200 });
    } catch (error) {
      console.error('Error Deleting User:', error);
      return new Response('Error: Could not delete user', {
        status: 400,
      });
    }
  }

  return new Response('Webhook received', { status: 200 });
}