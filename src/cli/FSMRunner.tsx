import React, { useState } from 'react';
import { Box, Text, useApp } from 'ink';
import TextInput from 'ink-text-input';
import { toDecimal, isBinaryInput } from '../utils.js';
import type { FSM } from '../fsm/FSM.js';
import type { BinaryInput, State } from '../types.js';
import type { MenuOption } from './MainMenu.js';

interface FSMRunnerProps {
  fsm: FSM<State, BinaryInput>;
  fsmType: MenuOption | null;
  paramLabel: string;
  onBack: () => void;
}

export const FSMRunner: React.FC<FSMRunnerProps> = ({
  fsm,
  fsmType,
  paramLabel,
  onBack,
}) => {
  const { exit } = useApp();
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isAccepting, setIsAccepting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const calculateState = (val: string) => {
    if (!val) {
      setResult(null);
      setIsAccepting(false);
      setError(null);
      return;
    }

    if (val === 'exit' || val === 'back') {
      return;
    }

    if (!isBinaryInput(val)) {
      setResult(null);
      return;
    }

    try {
      fsm.reset(); // Reset to initial state

      for (const char of val) {
        fsm.transition(char as BinaryInput);
      }

      setResult(fsm.getState());
      setIsAccepting(fsm.isAccepting());
      setError(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOnChange = (val: string) => {
    setInput(val);
    calculateState(val);
  };

  const handleSubmit = (val: string) => {
    if (val === 'exit') {
      exit();
      return;
    }
    if (val === 'back') {
      onBack();
      return;
    }

    if (!isBinaryInput(val)) {
      setError('Invalid binary input.');
      return;
    }

    calculateState(val);
  };

  const cleanStateValue = (val: string) => {
    // Strips "S" and just returns the number part as string
    // e.g. "S2" -> "2"
    // Used for Remainder or Count
    return val.replace('S', '');
  };

  const getResultLabels = () => {
    if (!result) return null;

    const cleaned = cleanStateValue(result);

    if (fsmType === 'MODULO') {
      return (
        <>
          <Box>
            <Text>
              Current State: <Text color="yellow">{result}</Text>
            </Text>
          </Box>
          <Box>
            <Text>
              Remainder:{' '}
              <Text color="magenta" bold>
                {cleaned}
              </Text>
            </Text>
          </Box>
        </>
      );
    }

    // For Last N Ones, maybe useful to see current streak?
    return (
      <Box>
        <Text>
          Current State:{' '}
          <Text color="yellow" bold>
            {result}
          </Text>{' '}
          (Streak: {cleaned})
        </Text>
      </Box>
    );
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text>{paramLabel}</Text>
      </Box>
      <Text>Enter Binary Sequence:</Text>
      <Box>
        <Text color="cyan">{'> '}</Text>
        <TextInput
          value={input}
          onChange={handleOnChange}
          onSubmit={handleSubmit}
        />
      </Box>

      {isBinaryInput(input) && input.length > 0 && (
        <Box flexDirection="column" marginTop={1}>
          <Text dimColor>Decimal: {toDecimal(input)}</Text>
        </Box>
      )}

      {error && <Text color="red">Error: {error}</Text>}

      {result && isBinaryInput(input) && input.length > 0 && (
        <Box
          marginTop={1}
          flexDirection="column"
          borderStyle="round"
          borderColor={isAccepting ? 'green' : 'red'}
          paddingX={1}
          paddingY={1}
        >
          {getResultLabels()}

          <Box>
            <Text>
              Accepting:{' '}
              <Text color={isAccepting ? 'green' : 'red'} bold>
                {isAccepting ? 'YES' : 'NO'}
              </Text>
            </Text>
          </Box>
        </Box>
      )}

      <Box marginTop={1}>
        <Text dimColor>Type 'back' to configuration, 'exit' to quit</Text>
      </Box>
    </Box>
  );
};
