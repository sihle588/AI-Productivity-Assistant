/* AI provider hook: define window.AI_CONFIG.complete(prompt) to return a string.
 * Never put a secret API key in front-end code; call your own backend instead. */
window.AI_CONFIG = {
  // complete: async (prompt) => {
  //   const res = await fetch('/api/complete', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt})});
  //   if (!res.ok) throw { message: 'AI request failed (' + res.status + ')' };
  //   return (await res.json()).text;
  // }
};
