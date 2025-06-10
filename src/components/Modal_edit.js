import React, { useState, useEffect } from 'react';
import './Modal_edit.css';
import ModalEditAdd from './Modal_edit_add';

export default function PlanModalEdit({ visible, onClose, onEdit, placeList, setPlaceList, savedLocations }) {
  // 장소 추가 모달 여부
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  if (!visible) return null;
  return (
    <div className="modal_edit_modal-overlay" onClick={onClose}>
      <div className="modal_edit_modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal_edit_modal-header">
          <h2>Edit Plan</h2>
          <button className="modal_edit_modal-close" onClick={onClose}>
            ⨉
          </button>
        </div>

        {/* Body */}
        <div className="modal_edit_modal-body">
          <label className="modal_edit_modal-label">Plan List</label>
          <div className="modal_edit_modal-input-group">
            {placeList.map((placeId) => {
              const place = savedLocations.find(loc => loc.id === placeId);
              if (!place) return null;
              return (
                <div key={place.id} className="modal_edit_plan_card">
                  <img
                    src={place.img || place.image || ''}
                    alt={place.name || place.title}
                    className="modal_edit_plan_card__image"
                  />
                  <div className="modal_edit_plan_card__body">
                    <div className="modal_edit_plan_card__title">
                      <span>{place.name || place.title}</span>
                    </div>
                    {place.description && (
                      <p className="modal_edit_plan_card__desc">{place.description}</p>
                    )}
                    {place.address && (
                      <div className="modal_edit_plan_card__address">
                        <span>{place.address}</span>
                      </div>
                    )}
                  </div>
                  <button
                    className="modal_edit_plan_card__delete"
                    title="삭제하기"
                    onClick={() => {
                      // 선택된 placeId를 제거
                      setPlaceList(prev => prev.filter(id => id !== place.id));
                    }}
                  >
                    ×
                  </button>
                </div>
              );
            })}

            {/* 장소 추가 버튼 */}
            <button
              className="modal_edit_modal-edit_add-button"
              onClick={() => setAddModalOpen(true)}
            >
              + 장소 추가
            </button>
            <ModalEditAdd
              visible={isAddModalOpen}
              onClose={() => setAddModalOpen(false)}
              savedLocations={savedLocations}
              onSelectPlace={id => setPlaceList(prev => [...prev, id])}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="modal_edit_modal-footer">
          <button className="modal_edit_btn-create" onClick={onEdit}>
            수정
          </button>
        </div>
      </div>
    </div>
  );
}
