import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  ExternalLink,
  Save,
  X,
  Link as LinkIcon,
} from "lucide-react";

import {
  getMyLinks,
  createLink,
  updateLink,
  deleteLink,
  reorderLinks,
} from "../services/linkService";
import BackButton from "../components/BackButton";

import "../styles/Links.css";

// ========================================
// SORTABLE LINK ITEM
// ========================================

const SortableLink = ({
  link,
  editingId,
  editTitle,
  editUrl,
  setEditTitle,
  setEditUrl,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onToggle,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: link._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : "auto",
  };

  const isEditing = editingId === link._id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`link-item ${
        isDragging ? "link-item-dragging" : ""
      } ${!link.isActive ? "link-item-disabled" : ""}`}
    >
      {/* DRAG HANDLE */}
      <button
        type="button"
        className="drag-handle"
        {...attributes}
        {...listeners}
        title="Drag to reorder"
      >
        <GripVertical size={20} />
      </button>

      {isEditing ? (
        /* =========================
           EDIT MODE
        ========================== */
        <div className="link-edit-form">
          <div className="form-field">
            <label htmlFor={`title-${link._id}`}>
              Link Title
            </label>

            <input
              id={`title-${link._id}`}
              type="text"
              value={editTitle}
              onChange={(e) =>
                setEditTitle(e.target.value)
              }
              placeholder="Instagram"
            />
          </div>

          <div className="form-field">
            <label htmlFor={`url-${link._id}`}>
              URL
            </label>

            <input
              id={`url-${link._id}`}
              type="url"
              value={editUrl}
              onChange={(e) =>
                setEditUrl(e.target.value)
              }
              placeholder="https://instagram.com/username"
            />
          </div>

          <div className="edit-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={() =>
                onSaveEdit(link._id)
              }
            >
              <Save size={16} />
              Save Changes
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={onCancelEdit}
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* =========================
           NORMAL MODE
        ========================== */
        <div className="link-content">
          <div className="link-main">
            <div className="link-icon">
              <LinkIcon size={20} />
            </div>

            <div className="link-info">
              <div className="link-title-row">
                <h3>{link.title}</h3>

                <span
                  className={`link-status ${
                    link.isActive
                      ? "status-active"
                      : "status-disabled"
                  }`}
                >
                  {link.isActive
                    ? "Active"
                    : "Disabled"}
                </span>
              </div>

              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-url"
              >
                {link.url}
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <div className="link-actions">
            <button
              type="button"
              className="icon-button"
              onClick={() => onEdit(link)}
              title="Edit link"
            >
              <Pencil size={17} />
            </button>

            <button
              type="button"
              className="icon-button"
              onClick={() => onToggle(link)}
              title={
                link.isActive
                  ? "Disable link"
                  : "Enable link"
              }
            >
              {link.isActive ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}
            </button>

            <button
              type="button"
              className="icon-button danger"
              onClick={() =>
                onDelete(link._id)
              }
              title="Delete link"
            >
              <Trash2 size={17} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ========================================
// LINKS PAGE
// ========================================

const Links = () => {
  const [links, setLinks] = useState([]);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");

  // ========================================
  // LOAD LINKS
  // ========================================

  const loadLinks = async () => {
    try {
      setLoading(true);

      const data = await getMyLinks();

      setLinks(data.links || []);
    } catch (error) {
      console.error(
        "Failed to load links:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  // ========================================
  // ADD LINK
  // ========================================

  const handleAddLink = async (e) => {
    e.preventDefault();

    if (!title.trim() || !url.trim()) {
      return;
    }

    try {
      setSaving(true);

      const data = await createLink({
        title: title.trim(),
        url: url.trim(),
      });

      setLinks((prev) => [
        ...prev,
        data.link,
      ]);

      setTitle("");
      setUrl("");
    } catch (error) {
      console.error(
        "Failed to create link:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // START EDITING
  // ========================================

  const handleEdit = (link) => {
    setEditingId(link._id);
    setEditTitle(link.title);
    setEditUrl(link.url);
  };

  // ========================================
  // CANCEL EDIT
  // ========================================

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditUrl("");
  };

  // ========================================
  // SAVE EDIT
  // ========================================

  const handleSaveEdit = async (id) => {
    if (
      !editTitle.trim() ||
      !editUrl.trim()
    ) {
      return;
    }

    try {
      const data = await updateLink(id, {
        title: editTitle.trim(),
        url: editUrl.trim(),
      });

      setLinks((prev) =>
        prev.map((link) =>
          link._id === id
            ? data.link
            : link
        )
      );

      handleCancelEdit();
    } catch (error) {
      console.error(
        "Failed to update link:",
        error
      );
    }
  };

  // ========================================
  // ENABLE / DISABLE
  // ========================================

  const handleToggle = async (link) => {
    try {
      const data = await updateLink(
        link._id,
        {
          isActive: !link.isActive,
        }
      );

      setLinks((prev) =>
        prev.map((item) =>
          item._id === link._id
            ? data.link
            : item
        )
      );
    } catch (error) {
      console.error(
        "Failed to update link:",
        error
      );
    }
  };

  // ========================================
  // DELETE LINK
  // ========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this link?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteLink(id);

      setLinks((prev) =>
        prev.filter(
          (link) => link._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete link:",
        error
      );
    }
  };

  // ========================================
  // DRAG END
  // ========================================

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (
      !over ||
      active.id === over.id
    ) {
      return;
    }

    const oldIndex = links.findIndex(
      (link) => link._id === active.id
    );

    const newIndex = links.findIndex(
      (link) => link._id === over.id
    );

    if (
      oldIndex === -1 ||
      newIndex === -1
    ) {
      return;
    }

    const newLinks = arrayMove(
      links,
      oldIndex,
      newIndex
    );

    setLinks(newLinks);

    try {
      await reorderLinks(
        newLinks.map((link) => ({
          id: link._id,
        }))
      );
    } catch (error) {
      console.error(
        "Failed to reorder links:",
        error
      );

      loadLinks();
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="links-page">
        <div className="links-loading">
          <div className="loading-spinner"></div>
          <p>Loading your links...</p>
        </div>
      </div>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <div className="links-page">
        <BackButton fallback="/dashboard" />
      {/* =========================
          HEADER
      ========================== */}
      <header className="links-header">
        <div>
          <p className="links-eyebrow">
            LINK MANAGEMENT
          </p>

          <h1>My Links</h1>

          <p className="links-subtitle">
            Add and organize the links you want
            to share with your audience.
          </p>
        </div>

        <div className="links-count">
          <strong>{links.length}</strong>
          <span>
            {links.length === 1
              ? "Link"
              : "Links"}
          </span>
        </div>
      </header>

      {/* =========================
          ADD LINK CARD
      ========================== */}
      <section className="add-link-card">
        <div className="add-link-heading">
          <div className="add-link-icon">
            <Plus size={22} />
          </div>

          <div>
            <h2>Add a new link</h2>

            <p>
              Add a website, social profile,
              portfolio or anything you want
              to share.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleAddLink}
          className="add-link-form"
        >
          <div className="form-field">
            <label htmlFor="link-title">
              Link Title
            </label>

            <input
              id="link-title"
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="My Instagram"
            />
          </div>

          <div className="form-field">
            <label htmlFor="link-url">
              URL
            </label>

            <input
              id="link-url"
              type="url"
              value={url}
              onChange={(e) =>
                setUrl(e.target.value)
              }
              placeholder="https://instagram.com/username"
            />
          </div>

          <button
            type="submit"
            className="add-link-button"
            disabled={
              saving ||
              !title.trim() ||
              !url.trim()
            }
          >
            <Plus size={18} />

            {saving
              ? "Adding..."
              : "Add Link"}
          </button>
        </form>
      </section>

      {/* =========================
          LINKS LIST
      ========================== */}
      <section className="links-list-section">
        <div className="list-heading">
          <div>
            <h2>Your links</h2>

            <p>
              Drag and drop to change their
              order.
            </p>
          </div>
        </div>

        {links.length === 0 ? (
          <div className="empty-links">
            <div className="empty-icon">
              <LinkIcon size={28} />
            </div>

            <h3>No links yet</h3>

            <p>
              Add your first link above to
              start building your profile.
            </p>
          </div>
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={links.map(
                (link) => link._id
              )}
              strategy={
                verticalListSortingStrategy
              }
            >
              <div className="links-list">
                {links.map((link) => (
                  <SortableLink
                    key={link._id}
                    link={link}
                    editingId={editingId}
                    editTitle={editTitle}
                    editUrl={editUrl}
                    setEditTitle={
                      setEditTitle
                    }
                    setEditUrl={setEditUrl}
                    onEdit={handleEdit}
                    onSaveEdit={
                      handleSaveEdit
                    }
                    onCancelEdit={
                      handleCancelEdit
                    }
                    onToggle={
                      handleToggle
                    }
                    onDelete={
                      handleDelete
                    }
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </section>
    </div>
  );
};

export default Links;