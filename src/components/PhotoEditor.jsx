import React, { useState } from 'react';
import { Upload, Trash2, ArrowUp, ArrowDown, Plus, RotateCcw, Check, X, Image as ImageIcon } from 'lucide-react';
import { saveStoredMemories, clearStoredMemories } from '../utils/storage';
import { birthdayContent } from '../data/birthdayContent';

export default function PhotoEditor({ memories, onUpdate, onClose }) {
  const [items, setItems] = useState([...memories]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Handle uploading an image
  const handleImageUpload = (index, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const updated = [...items];
      updated[index] = {
        ...updated[index],
        image: dataUrl,
      };
      setItems(updated);
    };
    reader.readAsDataURL(file);
  };

  // Handle caption change
  const handleCaptionChange = (index, text) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      caption: text,
    };
    setItems(updated);
  };

  // Move memory up
  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setItems(updated);
  };

  // Move memory down
  const moveDown = (index) => {
    if (index === items.length - 1) return;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setItems(updated);
  };

  // Add memory
  const addMemory = () => {
    const newId = Date.now();
    const updated = [
      ...items,
      {
        id: newId,
        image: '',
        caption: 'A precious moment with you ❤️',
        rotation: (Math.random() - 0.5) * 6,
      },
    ];
    setItems(updated);
  };

  // Delete memory
  const deleteMemory = (index) => {
    if (items.length <= 1) {
      alert('Keep at least 1 memory card!');
      return;
    }
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  // Save changes to IndexedDB
  const handleSave = async () => {
    await saveStoredMemories(items);
    onUpdate(items);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  // Reset to default memories from config
  const handleResetDefaults = async () => {
    if (window.confirm('Reset all memories to the original defaults?')) {
      await clearStoredMemories();
      const defaults = birthdayContent.memories;
      setItems(defaults);
      onUpdate(defaults);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        backgroundColor: 'rgba(35, 15, 20, 0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeInText 0.25s ease',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '88vh',
          backgroundColor: '#fffcf9',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(100, 20, 40, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid rgba(235, 140, 160, 0.3)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #f2e2de',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, #fff9f6 0%, #fffcf9 100%)',
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: '24px',
                fontWeight: 600,
                color: '#7f2843',
              }}
            >
              ✎ Customize Memory Lane
            </h2>
            <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#9d6371' }}>
              Upload your photos & captions — stored privately in your browser!
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close editor"
            style={{
              background: '#faeae6',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#7f2843',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* List of Memory Cards */}
        <div
          style={{
            padding: '20px 24px',
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          {items.map((item, idx) => (
            <div
              key={item.id || idx}
              style={{
                background: '#ffffff',
                border: '1px solid #fae3de',
                borderRadius: '16px',
                padding: '16px',
                boxShadow: '0 4px 12px rgba(160, 60, 80, 0.05)',
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
              }}
            >
              {/* Photo preview / upload box */}
              <div style={{ position: 'relative', width: '84px', height: '94px', flexShrink: 0 }}>
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '10px',
                    border: '1px solid #ebd0ca',
                    backgroundColor: '#faf2ef',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={`Photo ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    style={{
                      display: item.image ? 'none' : 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#a86576',
                    }}
                  >
                    <ImageIcon size={20} />
                    <span style={{ fontSize: '10px', textAlign: 'center', fontWeight: 500 }}>
                      Photo {idx + 1}
                    </span>
                  </div>
                </div>

                {/* Upload overlay button */}
                <label
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '10px',
                    backgroundColor: 'rgba(120, 30, 50, 0.35)',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                >
                  <Upload size={18} />
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleImageUpload(idx, e.target.files[0])}
                  />
                </label>
              </div>

              {/* Caption Input & Controls */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#88314a' }}>
                    Memory #{idx + 1}
                  </span>
                  <label
                    style={{
                      fontSize: '12px',
                      color: '#c23c62',
                      cursor: 'pointer',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Upload size={12} /> Replace Photo
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleImageUpload(idx, e.target.files[0])}
                    />
                  </label>
                </div>

                <input
                  type="text"
                  value={item.caption || ''}
                  onChange={(e) => handleCaptionChange(idx, e.target.value)}
                  placeholder="Write a tender caption for Jaya..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #ebd0ca',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    color: '#42282a',
                    outline: 'none',
                    backgroundColor: '#fffdfc',
                  }}
                />
              </div>

              {/* Action Buttons: Up, Down, Delete */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button
                  onClick={() => moveUp(idx)}
                  disabled={idx === 0}
                  title="Move Up"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: idx === 0 ? 'default' : 'pointer',
                    color: idx === 0 ? '#ddd' : '#88314a',
                    padding: '3px',
                  }}
                >
                  <ArrowUp size={15} />
                </button>
                <button
                  onClick={() => moveDown(idx)}
                  disabled={idx === items.length - 1}
                  title="Move Down"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: idx === items.length - 1 ? 'default' : 'pointer',
                    color: idx === items.length - 1 ? '#ddd' : '#88314a',
                    padding: '3px',
                  }}
                >
                  <ArrowDown size={15} />
                </button>
                <button
                  onClick={() => deleteMemory(idx)}
                  title="Delete Card"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#c23c62',
                    padding: '3px',
                  }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}

          {/* Add Another Memory Button */}
          <button
            onClick={addMemory}
            style={{
              padding: '12px',
              border: '2px dashed #e9c2cb',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 240, 245, 0.4)',
              color: '#8e2d4b',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Plus size={16} /> Add Another Memory Card
          </button>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #f2e2de',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#fffbf9',
          }}
        >
          <button
            onClick={handleResetDefaults}
            title="Reset to default config"
            style={{
              background: 'none',
              border: 'none',
              color: '#9c5b6b',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={14} /> Reset Defaults
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '9px 18px',
                borderRadius: '20px',
                border: '1px solid #ebd0ca',
                background: '#ffffff',
                color: '#733748',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: '9px 22px',
                borderRadius: '20px',
                border: 'none',
                background: saveSuccess
                  ? '#2e8b57'
                  : 'linear-gradient(135deg, #e83e6d 0%, #cb1d53 100%)',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(200, 30, 80, 0.25)',
                transition: 'background 0.3s ease',
              }}
            >
              {saveSuccess ? (
                <>
                  <Check size={15} /> Saved!
                </>
              ) : (
                'Save Memories'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
