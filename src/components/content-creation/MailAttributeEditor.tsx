
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface MailAttributeEditorProps {
  mailFrom: string;
  setMailFrom: (from: string) => void;
  mailTo: string;
  setMailTo: (to: string) => void;
}

const MailAttributeEditor: React.FC<MailAttributeEditorProps> = ({
  mailFrom,
  setMailFrom,
  mailTo,
  setMailTo
}) => {
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
        <Label htmlFor="to" className="text-sm">To</Label>
        <Input
          id="to"
          type="email"
          placeholder="recipient@example.com"
          value={mailTo}
          onChange={(e) => setMailTo(e.target.value)}
        />
      </div>
    </div>
  );
};

export default MailAttributeEditor;
