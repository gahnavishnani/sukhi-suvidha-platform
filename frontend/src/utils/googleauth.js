/* global google */

export const initGoogle = (callback) => {
  if (!window.google) return;

  google.accounts.id.initialize({
    client_id: "483013795555-kqtfmgvnis84v723lvc99dl2aq31muih.apps.googleusercontent.com", // ← replace during deployment
    callback,
    auto_select: true, // auto-login when possible
  });
};

export const renderGoogleButton = (elementId) => {
  if (!window.google) return;

  google.accounts.id.renderButton(
    document.getElementById(elementId),
    {
      theme: "outline",
      size: "large",
      width: 280,
    }
  );
};

export const promptGoogleOneTap = () => {
  if (!window.google) return;
  google.accounts.id.prompt(); // triggers auto-login popup
};
