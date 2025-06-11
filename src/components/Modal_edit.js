import React, { useState } from 'react';
import './Modal_edit.css';
import ModalEditAdd from './Modal_edit_add';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function PlanModalEdit({ visible, onClose, onEdit, placeList, setPlaceList, savedLocations }) {
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  // 드래그 앤 드롭 완료 시 순서 재정렬
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(placeList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setPlaceList(items);
  };

  if (!visible) return null;

  return (
    <div className="modal_edit_modal-overlay" onClick={onClose}>
      <div className="modal_edit_modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal_edit_modal-header">
          <h2>Edit Plan</h2>
          <button className="modal_edit_modal-close" onClick={onClose}>⨉</button>
        </div>

        {/* Body */}
        <div className="modal_edit_modal-body">
          <label className="modal_edit_modal-label">Plan List</label>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="places">
              {(provided) => (
                <div
                  className="modal_edit_modal-input-group"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {placeList.map((placeId, index) => {
                    const place = savedLocations.find(loc => loc.id === placeId);
                    if (!place) return null;
                    return (
                      <Draggable key={place.id} draggableId={String(place.id)} index={index}>
                        {(provided) => (
                          <div
                            className="modal_edit_plan_card"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
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
                              onClick={() => setPlaceList(prev => prev.filter(id => id !== place.id))}
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}

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
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Footer */}
        <div className="modal_edit_modal-footer">
          <button className="modal_edit_btn-create" onClick={onEdit}>수정</button>
        </div>
      </div>
    </div>
  );
}
