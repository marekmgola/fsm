import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';

export type MenuOption = 'MODULO' | 'LAST_N';

interface MainMenuProps {
  onSelect: (option: MenuOption) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onSelect }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const options: { label: string; value: MenuOption }[] = [
    { label: 'Modulo N FSM', value: 'MODULO' },
    { label: 'Last N Ones FSM', value: 'LAST_N' },
  ];

  useInput((input, key) => {
    if (key.upArrow) {
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    }
    if (key.downArrow) {
      setSelectedIndex((prev) => Math.min(options.length - 1, prev + 1));
    }
    if (key.return) {
      const selectedOption = options[selectedIndex];
      if (selectedOption) {
        onSelect(selectedOption.value);
      }
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold underline>
        Select FSM Type:
      </Text>
      <Box flexDirection="column" marginTop={1}>
        {options.map((opt, index) => (
          <Text
            key={opt.value}
            color={index === selectedIndex ? 'green' : 'white'}
          >
            {index === selectedIndex ? '> ' : '  '}
            {opt.label}
          </Text>
        ))}
      </Box>
      <Box marginTop={1}>
        <Text dimColor>Use Arrow Keys to select, Enter to confirm</Text>
      </Box>
    </Box>
  );
};
