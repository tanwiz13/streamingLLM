export function streamLLM({
  prompt,
  onToken,
  onDone,
}: {
  prompt: string;
  onToken: (token: string) => void;
  onDone?: () => void;
}) {
  const xhr = new XMLHttpRequest();

  xhr.open("POST", "http://localhost:3000/stream");

  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Accept", "text/event-stream");

  let lastIndex = 0;
  let buffer = "";

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 3 || xhr.readyState === 4) {
      // LOADING or DONE → partial response available
      const newText = xhr.responseText.substring(lastIndex);
      lastIndex = xhr.responseText.length;

      buffer += newText;

      const parts = buffer.split("\n\n");
      buffer = parts.pop() || "";

      for (const part of parts) {
        if (!part.startsWith("data:")) continue;

        const data = part.replace("data:", "").trim();

        if (data === "[DONE]") {
          onDone?.();
          return;
        }

        try {
          const json = JSON.parse(data);
          const token = json?.choices?.[0]?.delta?.content;

          if (token) {
            onToken(token);
          }
        } catch {}
      }
    }
  };

  xhr.onerror = () => {
    console.log("Stream error");
  };

  xhr.send(
    JSON.stringify({
      prompt,
      stream: true,
    })
  );

  return () => {
    xhr.abort(); // stop support
  };
}