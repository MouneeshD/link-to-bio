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
  getMyLinks,
  createLink,
  updateLink,
  deleteLink,
  reorderLinks,
} from "../services/linkService";


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
  } = useSortable({
    id: link._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: "1px solid #ddd",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "8px",
    background: "#fff",
  };

  const isEditing = editingId === link._id;

  return (
    <div
      ref={setNodeRef}
      style={style}
    >
      {/* DRAG HANDLE */}

      <div
        {...attributes}
        {...listeners}
        style={{
          cursor: "grab",
          marginBottom: "10px",
          fontWeight: "bold",
        }}
      >
        ☰ Drag
      </div>


      {isEditing ? (
        <>
          {/* EDIT TITLE */}

          <div
            style={{
              marginBottom: "10px",
            }}
          >
            <label>
              Title
            </label>

            <br />

            <input
              type="text"
              value={editTitle}
              onChange={(e) =>
                setEditTitle(e.target.value)
              }
              style={{
                width: "100%",
                padding: "10px",
              }}
            />
          </div>


          {/* EDIT URL */}

          <div
            style={{
              marginBottom: "10px",
            }}
          >
            <label>
              URL
            </label>

            <br />

            <input
              type="url"
              value={editUrl}
              onChange={(e) =>
                setEditUrl(e.target.value)
              }
              style={{
                width: "100%",
                padding: "10px",
              }}
            />
          </div>


          {/* SAVE */}

          <button
            onClick={() =>
              onSaveEdit(link._id)
            }
          >
            Save
          </button>


          {/* CANCEL */}

          <button
            onClick={onCancelEdit}
            style={{
              marginLeft: "10px",
            }}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          {/* NORMAL VIEW */}

          <h3>{link.title}</h3>

          <p>
            {link.url}
          </p>

          <p>
            Status:{" "}
            {link.isActive
              ? "Active"
              : "Disabled"}
          </p>


          {/* EDIT */}

          <button
            onClick={() => onEdit(link)}
          >
            Edit
          </button>


          {/* ENABLE / DISABLE */}

          <button
            onClick={() =>
              onToggle(link)
            }
            style={{
              marginLeft: "10px",
            }}
          >
            {link.isActive
              ? "Disable"
              : "Enable"}
          </button>


          {/* DELETE */}

          <button
            onClick={() =>
              onDelete(link._id)
            }
            style={{
              marginLeft: "10px",
            }}
          >
            Delete
          </button>
        </>
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
  const [editingId, setEditingId] =
    useState(null);

  const [editTitle, setEditTitle] =
    useState("");

  const [editUrl, setEditUrl] =
    useState("");


  // ========================================
  // LOAD LINKS
  // ========================================

  const loadLinks = async () => {
    try {
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

    if (
      !title.trim() ||
      !url.trim()
    ) {
      return;
    }

    try {
      setSaving(true);

      const data = await createLink({
        title,
        url,
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
        title: editTitle,
        url: editUrl,
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
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this link?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteLink(id);

      setLinks((prev) =>
        prev.filter(
          (link) =>
            link._id !== id
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

    const oldIndex =
      links.findIndex(
        (link) =>
          link._id === active.id
      );

    const newIndex =
      links.findIndex(
        (link) =>
          link._id === over.id
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
        newLinks.map(
          (link) => ({
            id: link._id,
          })
        )
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
      <p>
        Loading links...
      </p>
    );
  }


  // ========================================
  // UI
  // ========================================

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1>
        My Links
      </h1>


      {/* ADD LINK FORM */}

      <form
        onSubmit={handleAddLink}
        style={{
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            marginBottom: "15px",
          }}
        >
          <label>
            Title
          </label>

          <br />

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="My Instagram"
            style={{
              width: "100%",
              padding: "10px",
            }}
          />
        </div>


        <div
          style={{
            marginBottom: "15px",
          }}
        >
          <label>
            URL
          </label>

          <br />

          <input
            type="url"
            value={url}
            onChange={(e) =>
              setUrl(e.target.value)
            }
            placeholder="https://instagram.com/username"
            style={{
              width: "100%",
              padding: "10px",
            }}
          />
        </div>


        <button
          type="submit"
          disabled={saving}
        >
          {saving
            ? "Adding..."
            : "Add Link"}
        </button>
      </form>


      <hr />


      {/* LINKS LIST */}

      {links.length === 0 ? (
        <p>
          No links yet.
          Add your first link!
        </p>
      ) : (
        <DndContext
          collisionDetection={
            closestCenter
          }
          onDragEnd={
            handleDragEnd
          }
        >
          <SortableContext
            items={links.map(
              (link) =>
                link._id
            )}
            strategy={
              verticalListSortingStrategy
            }
          >
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
                setEditUrl={
                  setEditUrl
                }
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
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default Links;