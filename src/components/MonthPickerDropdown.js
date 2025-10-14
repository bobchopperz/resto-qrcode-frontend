"use client";

import { useState } from 'react';
import { Popover, Button } from '@mantine/core';
import { MonthPicker } from '@mantine/dates';
import 'dayjs/locale/id';

function MonthPickerDropdown({ value, onChange }) {
  const [opened, setOpened] = useState(false);

  const handleMonthSelect = (date) => {
    onChange(date);
    setOpened(false);
  };

  const buttonLabel = value.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom-end"
      withArrow
      shadow="md"
    >
      <Popover.Target>
        <Button
          onClick={() => setOpened((o) => !o)}
          variant="outline"
          color="gray"
        >
          {buttonLabel}
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <MonthPicker
          locale="id"
          value={value}
          onChange={handleMonthSelect}
          maxDate={new Date()}
        />
      </Popover.Dropdown>
    </Popover>
  );
}

export default MonthPickerDropdown;
