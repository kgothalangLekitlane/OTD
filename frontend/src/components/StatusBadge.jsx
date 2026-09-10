import { Badge } from '@chakra-ui/react';

const statusStyles = {
  paid: 'green',
  approved: 'green',
  active: 'green',
  completed: 'green',
  pending: 'yellow',
  scheduled: 'blue',
  unpaid: 'red',
  overdue: 'red',
  rejected: 'red',
  cancelled: 'gray',
  expired: 'gray',
};

export default function StatusBadge({ status, children }) {
  const label = children ?? status ?? 'Unknown';
  const colorPalette = statusStyles[String(status ?? '').toLowerCase()] ?? 'gray';

  return (
    <Badge colorPalette={colorPalette} variant="subtle" borderRadius="full" px="3" py="1">
      {label}
    </Badge>
  );
}
