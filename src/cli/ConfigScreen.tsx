import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';

interface ConfigScreenProps {
  label: string;
  onBack: () => void;
  onSubmit: (n: number) => void;
}

export const ConfigScreen: React.FC<ConfigScreenProps> = ({
  label,
  onBack,
  onSubmit,
}) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (val: string) => {
    if (val.trim() === 'back') {
      onBack();
      return;
    }

    const parsed = parseInt(val, 10);
    if (isNaN(parsed) || parsed <= 0) {
      setError('Please enter a valid positive integer.');
      return;
    }
    onSubmit(parsed);
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Text>{label}</Text>
      <Box>
        <Text color="green">{'> '}</Text>
        <TextInput
          value={value}
          onChange={(v) => {
            setValue(v);
            setError(null);
          }}
          onSubmit={handleSubmit}
        />
      </Box>
      {error && <Text color="red">{error}</Text>}
      <Box marginTop={1}>
        <Text dimColor>Type 'back' to return to menu</Text>
      </Box>
    </Box>
  );
};
