import React, { useState } from 'react';
import { render, Box, Text } from 'ink';
import { MainMenu, type MenuOption } from './MainMenu.js';
import { ConfigScreen } from './ConfigScreen.js';
import { FSMRunner } from './FSMRunner.js'; // Assuming we fix exports
import { NModFSM } from '../fsm/NModFSM.js';
import { LastNOnesFSM } from '../fsm/LastNOnesFSM.js';
import type { FSM } from '../fsm/FSM.js';
import type { BinaryInput, State } from '../types.js';

type View = 'MENU' | 'CONFIG' | 'RUNNER';

const App = () => {
  const [view, setView] = useState<View>('MENU');
  const [fsmType, setFsmType] = useState<MenuOption | null>(null);
  const [fsmInstance, setFsmInstance] = useState<FSM<
    State,
    BinaryInput
  > | null>(null);
  const [paramLabel, setParamLabel] = useState('');

  const handleMenuSelect = (option: MenuOption) => {
    setFsmType(option);
    setView('CONFIG');
  };

  const handleConfigSubmit = (n: number) => {
    if (!fsmType) return;

    let instance: FSM<State, BinaryInput>;
    let label = '';

    if (fsmType === 'MODULO') {
      instance = new NModFSM(n);
      label = `FSM: Modulo ${n}`;
    } else {
      instance = new LastNOnesFSM(n);
      label = `FSM: Last ${n} Ones`;
    }

    setFsmInstance(instance);
    setParamLabel(label);
    setView('RUNNER');
  };

  const renderContent = () => {
    switch (view) {
      case 'MENU':
        return <MainMenu onSelect={handleMenuSelect} />;
      case 'CONFIG':
        return (
          <ConfigScreen
            label={
              fsmType === 'MODULO'
                ? 'Enter Modulus (N):'
                : 'Enter N (Number of 1s):'
            }
            onBack={() => setView('MENU')}
            onSubmit={handleConfigSubmit}
          />
        );
      case 'RUNNER':
        if (!fsmInstance)
          return <Text color="red">Error: No FSM Instance</Text>;
        return (
          <FSMRunner
            fsm={fsmInstance}
            fsmType={fsmType}
            paramLabel={paramLabel}
            onBack={() => setView('CONFIG')}
          />
        );
      default:
        return <Text>Unknown View</Text>;
    }
  };

  return (
    <Box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height={(process.stdout.rows || 24) - 2}
    >
      <Box
        borderStyle="double"
        padding={1}
        borderColor="cyan"
        flexDirection="column"
        width={80}
        height={20}
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

console.clear();
render(<App />);
