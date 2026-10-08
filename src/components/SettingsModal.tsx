import { Modal } from './Modal';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  if (!open) return null;
  return (
    <Modal title="Settings" onClose={onClose}>
      <div className="settings-section">
        <h3 className="settings-heading">Text-to-Speech</h3>
        <p className="settings-text">
          Translated speech is automatically played through your device speaker or headphones
          using the ElevenLabs voice engine. The default voice is pre-configured and works
          out of the box.
        </p>
      </div>
      <div className="settings-section">
        <h3 className="settings-heading">Microphone Access</h3>
        <p className="settings-text">
          Zend Lingua needs microphone permission to listen to your speech.
          You can revoke this at any time through your browser settings.
        </p>
      </div>
      <div className="settings-section">
        <h3 className="settings-heading">Data Privacy</h3>
        <p className="settings-text">
          Speech is processed on your device using your browser's built-in speech recognition.
          No audio is recorded or stored. Translation and text-to-speech requests are sent
          securely through server-side functions — your API keys are never exposed.
        </p>
      </div>
    </Modal>
  );
}
