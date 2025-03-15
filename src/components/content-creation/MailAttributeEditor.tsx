
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface MailAttributeEditorProps {
  mailFrom: string;
  setMailFrom: (from: string) => void;
  mailTo: string[];
  setMailTo: (to: string[]) => void;
  mailTags: string[];
  setMailTags: (tags: string[]) => void;
}

const MailAttributeEditor: React.FC<MailAttributeEditorProps> = ({
  mailFrom,
  setMailFrom,
  mailTo,
  setMailTo,
  mailTags,
  setMailTags
}) => {
  // Convert array to comma-separated string for display in input
  const toEmailsString = mailTo.join(', ');
  
  // Handle recipient emails input change
  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailsInput = e.target.value;
    // Convert comma-separated string to array
    const emailsArray = emailsInput.split(',').map(email => email.trim()).filter(email => email);
    setMailTo(emailsArray);
  };

  // Convert array to comma-separated string for display in input
  const tagsString = mailTags.join(', ');
  
  // Handle tags input change
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsInput = e.target.value;
    // Convert comma-separated string to array
    const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    setMailTags(tagsArray);
  };

  return (
    <div className="p-3 border border-mail/30 rounded-md bg-mail-light/10 space-y-3">
      <div className="space-y-2">
        <Label htmlFor="from" className="text-sm">From</Label>
        <Input
          id="from"
          type="email"
          placeholder="your.email@example.com"
          value={mailFrom}
          onChange={(e) => setMailFrom(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="to" className="text-sm">To (comma separated)</Label>
        <Input
          id="to"
          type="text"
          placeholder="recipient@example.com, another@example.com"
          value={toEmailsString}
          onChange={handleToChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mail-tags" className="text-sm">Tags (comma separated)</Label>
        <Input
          id="mail-tags"
          placeholder="important, work, reply-needed"
          value={tagsString}
          onChange={handleTagsChange}
        />
      </div>
    </div>
  );
};

export default MailAttributeEditor;
