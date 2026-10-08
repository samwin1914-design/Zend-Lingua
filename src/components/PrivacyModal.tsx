import { Modal } from './Modal';

interface PrivacyModalProps {
  open: boolean;
  onClose: () => void;
}

export function PrivacyModal({ open, onClose }: PrivacyModalProps) {
  if (!open) return null;
  return (
    <Modal title="Privacy Policy" onClose={onClose}>
      <div className="settings-section">
        <h3 className="settings-heading">1. No Secret Recording</h3>
        <p className="settings-text">
          Zend Lingua does not record or store your audio. Microphone access is only active
          while you are actively pressing the conversation button. No background listening occurs.
        </p>
      </div>
      <div className="settings-section">
        <h3 className="settings-heading">2. Speech Recognition</h3>
        <p className="settings-text">
          Speech-to-text is performed using your browser's built-in Web Speech API.
          Depending on your browser, speech data may be sent to your device manufacturer's
          servers for transcription. Zend Lingua does not intercept or store this data.
        </p>
      </div>
      <div className="settings-section">
        <h3 className="settings-heading">3. Translation & Text-to-Speech</h3>
        <p className="settings-text">
          Translated text is sent to a secure server-side function to generate spoken audio
          via the ElevenLabs API. The API key is stored securely on the server and is never
          exposed to your browser or included in source code.
        </p>
      </div>
      <div className="settings-section">
        <h3 className="settings-heading">4. No Data Storage</h3>
        <p className="settings-text">
          Conversation history is kept in your device's memory only for the current session.
          Clearing the conversation or closing the app removes all history. No data is
          persisted on any server.
        </p>
      </div>
      <div className="settings-section">
        <h3 className="settings-heading">5. Your Controls</h3>
        <p className="settings-text">
          You can clear conversation history at any time. You can revoke microphone permission
          through your browser settings. You can close the app at any time to stop all processing.
        </p>
      </div>
    </Modal>
  );
}
