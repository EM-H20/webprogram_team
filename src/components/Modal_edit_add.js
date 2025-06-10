import React from 'react';
import './Modal_edit_add.css';

export default function ModalEditAdd({ visible, onClose, savedLocations, onSelectPlace }) {
  if (!visible) return null;

  return (
    <div className="modal_edit_add_overlay" onClick={onClose}>
      <div className="modal_edit_add" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal_edit_add_header">
          <h2>Select Place</h2>
          <button className="modal_edit_add_close" onClick={onClose}>×</button>
        </div>

        {/* Body: savedLocations를 카드로 나열 */}
        <div className="modal_edit_add_body">
          {savedLocations.map(place => (
            <div
              key={place.id}
              className="modal_edit_add_card"
              onClick={() => {
                onSelectPlace(place.id);
                onClose();
              }}
            >
              <img
                src={place.img || place.image || ''}
                alt={place.name}
                className="modal_edit_add_card__image"
              />
              <div className="modal_edit_add_card__body">
                <div className="modal_edit_add_card__title">
                  <span>{place.name}</span>
                </div>
                {place.description && (
                  <p className="modal_edit_add_card__desc">{place.description}</p>
                )}
                {place.address && (
                  <div className="modal_edit_add_card__address">
                    <span>{place.address}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
