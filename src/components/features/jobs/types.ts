export interface CheckboxOption {
  label: string;
  value: string;
  count?: number;
}

export interface CheckboxFilterProps {
  title: string;
  options: CheckboxOption[];
  selectedValues: string[];
  onChange: (value: string, checked: boolean) => void;
}

export interface RangeFilterProps {
  title: string;
  min: number;
  max: number;
  value: number;
  unit: string;
  onChange: (value: number) => void;
}
