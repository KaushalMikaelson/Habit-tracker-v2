import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  return (
    <div className="page-placeholder">
      <div className="page-placeholder-icon">
        <SettingsIcon size={32} />
      </div>
      <h2 className="text-gradient-green">Settings</h2>
      <p>Manage your profile, preferences, and account settings here.</p>
    </div>
  );
}
