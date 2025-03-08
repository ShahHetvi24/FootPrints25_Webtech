import React, { useState } from "react";
import axios from "axios";
// import "./CreateSecretMessage.css";

function CreateSecretMessage({ username }) {
  const [content, setContent] = useState("");
  const [expiresIn, setExpiresIn] = useState(24);
  const [secretLink, setSecretLink] = useState("");
  const [expiryTime, setExpiryTime] = useState(null);
  const [copySuccess, setCopySuccess] = useState("");

  const createSecretMessage = async (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    try {
      const response = await axios.post("/api/secret-messages", {
        content,
        expiresInHours: expiresIn,
      });

      // Get the full URL for sharing
      const fullUrl = `${window.location.origin}${response.data.link}`;
      setSecretLink(fullUrl);
      setExpiryTime(new Date(response.data.expiresAt));
      setContent("");
    } catch (error) {
      console.error("Error creating secret message:", error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(secretLink)
      .then(() => {
        setCopySuccess("Copied!");
        setTimeout(() => setCopySuccess(""), 2000);
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  return (
    <div className="create-secret max-w-full px-4 md:px-6">
      <h2 className="text-center text-xl md:text-2xl lg:text-3xl mb-2 md:mb-3 text-white">
        Create a One-Time Secret Message
      </h2>
      <p className="description text-center mb-4 md:mb-5 text-white text-sm md:text-base">
        This message will self-destruct after being viewed once or when it
        expires.
      </p>

      {!secretLink ? (
        <form
          className="secret-form rounded-lg p-4 md:p-6 shadow-md max-w-3xl mx-auto"
          onSubmit={createSecretMessage}
        >
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md resize-vertical font-inherit mb-4 text-sm md:text-base"
            placeholder="Your secret message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            required
          />

          <div className="form-controls flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="expiry-control flex items-center w-full sm:w-auto">
              <label className="mr-2 text-sm md:text-base">Expires in:</label>
              <select
                className="p-2 md:p-3 border border-gray-300 rounded-md bg-white text-sm md:text-base flex-grow sm:flex-grow-0"
                value={expiresIn}
                onChange={(e) => setExpiresIn(parseInt(e.target.value))}
              >
                <option value={1}>1 hour</option>
                <option value={6}>6 hours</option>
                <option value={12}>12 hours</option>
                <option value={24}>24 hours</option>
                <option value={48}>48 hours</option>
                <option value={72}>3 days</option>
              </select>
            </div>

            <button
              className="w-full sm:w-auto py-2 px-4 md:py-3 md:px-5 bg-[var(--button-color)] text-white border-none rounded-md cursor-pointer text-sm md:text-base"
              type="submit"
            >
              Create Secret Link
            </button>
          </div>
        </form>
      ) : (
        <div className="secret-link-container bg-white p-4 md:p-6 rounded-lg shadow-md text-center max-w-3xl mx-auto">
          <h3 className="mt-0 text-gray-800 text-lg md:text-xl mb-4">
            Your secret message has been created!
          </h3>

          <div className="expiry-info mb-4">
            <p className="text-sm md:text-base mb-1">
              This link will expire on:
            </p>
            <p className="expiry-date font-bold text-pink-600 text-sm md:text-base">
              {expiryTime.toLocaleString()}
            </p>
          </div>

          <div className="link-box flex mb-4 flex-col sm:flex-row">
            <input
              className="flex-1 p-2 md:p-3 border border-gray-300 rounded-t-md sm:rounded-tr-none sm:rounded-l-md text-sm md:text-base w-full break-all"
              type="text"
              value={secretLink}
              readOnly
            />
            <button
              className="py-2 px-4 md:py-3 md:px-5 bg-custom-pink text-white border-none rounded-b-md sm:rounded-bl-none sm:rounded-r-md cursor-pointer transition-colors text-sm md:text-base"
              onClick={copyToClipboard}
            >
              {copySuccess || "Copy"}
            </button>
          </div>

          <div className="warning-note my-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-left">
            <p className="text-sm md:text-base my-1">
              ⚠️ Important: This link can only be viewed ONCE!
            </p>
            <p className="text-sm md:text-base my-1">
              After viewing, the message will be permanently deleted.
            </p>
          </div>

          <button
            className="create-new-btn py-2 px-4 md:py-3 md:px-5 bg-custom-pink text-white border-none rounded-md cursor-pointer mt-2 transition-colors text-sm md:text-base"
            onClick={() => setSecretLink("")}
          >
            Create Another Secret
          </button>
        </div>
      )}
    </div>
  );
}

export default CreateSecretMessage;
