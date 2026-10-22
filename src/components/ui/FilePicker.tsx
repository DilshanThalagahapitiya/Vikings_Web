import { useRef } from 'react';
import { Button } from './Button';

interface Props {
  accept: string;
  label: string;
  onFile: (file: File) => void;
}

export function FilePicker({ accept, label, onFile }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = '';
        }}
      />
      <Button variant="secondary" size="sm" onClick={() => ref.current?.click()}>
        {label}
      </Button>
    </>
  );
}
