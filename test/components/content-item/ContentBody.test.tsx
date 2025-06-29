import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ContentBody from '@/components/content-item/ContentBody';
import { Item, ContentAttributeType } from '@/lib/content-utils';

// Mock data for testing aligned with fixtures from test/fixtures/unchanged/
const mockNoteItem: Item = {
  id: 'reading-progress-book-1',
  title: 'Reading Progress - Book 1',
  content: '- CW15:\n  - [x] 2022-04-10\n  - [x] 2022-04-11\n  - ![[Finished reading Book 1 on 2022-04-14]]',
  createdAt: new Date('2022-04-07T22:00:00.000Z'),
  updatedAt: new Date('2022-08-03T22:00:00.000Z'),
  tags: [],
};

const mockTaskItem: Item = {
  id: 'shared-task',
  title: 'Finished reading Book 1 on 2022-04-14',
  content: 'This task is shared between multiple notes because it represents finishing Book 1, which is relevant to both reading progress notes.',
  createdAt: new Date('2022-04-08T07:28:33.085Z'),
  updatedAt: new Date('2022-08-04T10:22:45.007Z'),
  tags: [],
  done: true,
};

const mockEventItem: Item = {
  id: 'example-event',
  title: 'Example Event',
  content: 'This is an event scheduled for a specific date.',
  createdAt: new Date('2022-04-07T22:00:00.000Z'),
  updatedAt: new Date('2022-08-03T22:00:00.000Z'),
  tags: [],
  date: new Date('2025-06-26T00:00:00.000Z'),
  location: 'Test Location',
};

const mockMailItem: Item = {
  id: 'example-message',
  title: 'Example Message',
  content: 'This is a message with sender and recipient information.',
  createdAt: new Date('2022-04-07T22:00:00.000Z'),
  updatedAt: new Date('2022-08-03T22:00:00.000Z'),
  tags: [],
  from: 'sender@example.com',
  to: ['recipient@example.com'],
};

const mockOnUpdate = vi.fn();

describe('ContentBody Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders item title correctly for a note', () => {
    render(<ContentBody item={mockNoteItem} onUpdate={mockOnUpdate} processedContent={mockNoteItem.content} />);
    expect(screen.getByDisplayValue(mockNoteItem.title)).toBeInTheDocument();
  });

  test('renders item content correctly for a note', () => {
    render(<ContentBody item={mockNoteItem} onUpdate={mockOnUpdate} processedContent={mockNoteItem.content} />);
    expect(screen.getByText(/CW15/)).toBeInTheDocument();
  });

  test('allows editing and updating title', async () => {
    render(<ContentBody item={mockNoteItem} onUpdate={mockOnUpdate} processedContent={mockNoteItem.content} />);
    const titleInput = screen.getByDisplayValue(mockNoteItem.title);
    fireEvent.change(titleInput, { target: { value: 'Updated Note Title' } });
    fireEvent.blur(titleInput);
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith(expect.objectContaining({ title: 'Updated Note Title' }));
    });
  });

  test('displays task attributes when item is a task', () => {
    render(<ContentBody item={mockTaskItem} onUpdate={mockOnUpdate} processedContent={mockTaskItem.content} />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  test('toggles task done status', async () => {
    render(<ContentBody item={mockTaskItem} onUpdate={mockOnUpdate} processedContent={mockTaskItem.content} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith(expect.objectContaining({ done: false }));
    });
  });

  test('displays event attributes when item is an event', () => {
    render(<ContentBody item={mockEventItem} onUpdate={mockOnUpdate} processedContent={mockEventItem.content} />);
    expect(screen.getByText(mockEventItem.location)).toBeInTheDocument();
    expect(screen.getByText(/June 26th, 2025/)).toBeInTheDocument();
  });

  test('displays mail attributes when item is a message', () => {
    render(<ContentBody item={mockMailItem} onUpdate={mockOnUpdate} processedContent={mockMailItem.content} />);
    expect(screen.getByText(mockMailItem.from)).toBeInTheDocument();
    expect(screen.getByText(mockMailItem.to[0])).toBeInTheDocument();
  });

  test('allows editing content', () => {
    render(<ContentBody item={mockNoteItem} onUpdate={mockOnUpdate} processedContent={mockNoteItem.content} />);
    const editButton = screen.getByRole('button', { name: /edit content/i });
    fireEvent.click(editButton);
    expect(screen.getByRole('textbox', { name: /content editor/i })).toBeInTheDocument();
  });

  test('saves updated content', async () => {
    render(<ContentBody item={mockNoteItem} onUpdate={mockOnUpdate} processedContent={mockNoteItem.content} />);
    const editButton = screen.getByRole('button', { name: /edit content/i });
    fireEvent.click(editButton);
    const contentTextarea = screen.getByRole('textbox', { name: /content editor/i });
    fireEvent.change(contentTextarea, { target: { value: 'Updated Content Text' } });
    const saveButton = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith(expect.objectContaining({ content: 'Updated Content Text' }));
    });
  });
});
