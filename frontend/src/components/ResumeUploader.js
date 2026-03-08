import React, { useState, useCallback } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { FiUpload, FiX, FiFile, FiImage, FiFileText } from "react-icons/fi";
import "./ResumeUploader.css";

const ResumeUploader = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      setMessage({
        text: "Some files were rejected. Only PDF, DOC, DOCX, PNG, JPG allowed (max 10MB each).",
        type: "error",
      });
    }

    setFiles((prevFiles) => [
      ...prevFiles,
      ...acceptedFiles.map((file) => ({
        file,
        progress: 0,
        status: "pending",
        speed: 0,
      })),
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
  });

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes("image")) return <FiImage size={20} />;
    if (fileType.includes("pdf")) return <FiFileText size={20} />;
    if (fileType.includes("word") || fileType.includes("document"))
      return <FiFileText size={20} />;
    return <FiFile size={20} />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage({ text: "Please add files first.", type: "error" });
      return;
    }

    const uploadPromises = files.map((fileObj, index) => {
      const formData = new FormData();
      formData.append("resumes", fileObj.file);

      const config = {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const progress = Math.round((loaded * 100) / total);
          const speed = progressEvent.rate || 0; // bytes per second

          setFiles((prevFiles) => {
            const newFiles = [...prevFiles];
            newFiles[index] = {
              ...newFiles[index],
              progress,
              speed,
              status: progress === 100 ? "completed" : "uploading",
            };
            return newFiles;
          });
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      return axios.post(
        "http://localhost:8000/api/resumes/upload",
        formData,
        config
      );
    });

    try {
      setUploading(true);
      setMessage({ text: "", type: "" });
      await Promise.all(uploadPromises);
      setMessage({ text: "All files uploaded successfully!", type: "success" });
    } catch (error) {
      console.error(error);
      setMessage({ text: "Error uploading some files.", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Files</h2>

      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""}`}
      >
        <input {...getInputProps()} />
        <FiUpload size={48} />
        {isDragActive ? (
          <p>Drop the files here...</p>
        ) : (
          <p>Drag & drop files here, or click to select files</p>
        )}
        <p className="hint">
          Supported formats: PDF, DOC, DOCX, PNG, JPG (Max 10MB each)
        </p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <div className="file-list">
        {files.map((fileObj, index) => (
          <div key={index} className="file-item">
            <div className="file-info">
              {getFileIcon(fileObj.file.type)}
              <div>
                <p className="file-name">{fileObj.file.name}</p>
                <p className="file-size">{formatFileSize(fileObj.file.size)}</p>
              </div>
              {fileObj.status !== "uploading" && (
                <button
                  className="remove-btn"
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                >
                  <FiX size={18} />
                </button>
              )}
            </div>

            {fileObj.status !== "pending" && (
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{ width: `${fileObj.progress}%` }}
                ></div>
                <span className="progress-text">
                  {fileObj.status === "completed"
                    ? "Completed"
                    : `${fileObj.progress}% done • ${formatFileSize(
                        fileObj.speed
                      )}/sec`}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        className="upload-btn"
        onClick={handleUpload}
        disabled={uploading || files.length === 0}
      >
        {uploading ? "Uploading..." : "Upload Files"}
      </button>
    </div>
  );
};

export default ResumeUploader;
