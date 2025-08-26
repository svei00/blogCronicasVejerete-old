"use client";

import { Select } from "flowbite-react";

interface CategoriesSelectProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const CategoriesSelect: React.FC<CategoriesSelectProps> = ({
  value,
  onChange,
}) => {
  return (
    <Select value={value} onChange={onChange}>
      <option value="uncategorized">Select a category</option>
      <option value="alucines">Alucines</option>
      <option value="pensamientos">Pensamientos</option>
      <option value="borradores">Borradores</option>
    </Select>
  );
};

export default CategoriesSelect;
