import React, { useEffect, useState, useRef } from 'react';
import './Modal.css';

export default function PlanModal({ visible, onClose, onCreate, planName, setPlanName, description, setDescription, address, setAddress, uploadedImage, setUploadedImage, imagePreview, setImagePreview }) {
  const fileInputRef = useRef(null);

  if (!visible) return null;

  // 이미지 업로드 버튼 클릭 핸들러
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // 이미지 선택 핸들러
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 크기 검사 (최대 5MB로 제한)
      if (file.size > 5 * 1024 * 1024) {
        alert('이미지 크기는 5MB 이하여야 합니다.');
        return;
      }

      // 파일 타입 검사
      if (!file.type.match('image.*')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      // 이미지를 Base64로 인코딩
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result); // Base64 문자열 저장
        setImagePreview(event.target.result); // 미리보기용 URL 설정
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>Add new plan</h2>
          <button className="modal-close" onClick={onClose}>
            ⨉
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <label className="modal-label">Name</label>
          <div className="modal-input-group">
            <input
              type="text"
              placeholder="이름"
              value={planName}
              onChange={e => setPlanName(e.target.value)}
            />
          </div>

          <label className="modal-label">Descript</label>
          <textarea
            rows="4"
            placeholder="설명"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <label className="modal-label">Address</label>
          <div className="modal-input-group">
            <input
              type="text"
              placeholder="주소"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>

          {/* 이미지 업로드 섹션 */}
          <div className="plan_image-upload-section">
            <div className="plan_image-preview-container" onClick={triggerFileInput}>
              {imagePreview ? (
                <img src={imagePreview} alt="장소 이미지 미리보기" className="plan_image-preview" />
              ) : (
                <div className="plan_upload-placeholder">
                  <span>➕</span>
                  <p>사진 추가</p>
                </div>
              )}
            </div>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
            />
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-create" onClick={onCreate}>
            추가
          </button>
        </div>
      </div>
    </div>
  );
}
