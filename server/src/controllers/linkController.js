const Link = require("../models/Link");

// ========================================
// GET MY LINKS
// ========================================

const getMyLinks = async (req, res) => {
  try {
    const links = await Link.find({
      user: req.user.userId,
    }).sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      links,
    });
  } catch (error) {
    console.error("Get links error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// CREATE LINK
// ========================================

const createLink = async (req, res) => {
  try {
    const { title, url } = req.body;

    if (!title || !url) {
      return res.status(400).json({
        success: false,
        message: "Title and URL are required",
      });
    }

    const cleanTitle = title.trim();
    const cleanUrl = url.trim();

    if (cleanTitle.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title cannot be empty",
      });
    }

    if (cleanUrl.length === 0) {
      return res.status(400).json({
        success: false,
        message: "URL cannot be empty",
      });
    }

    // Find the highest current order
    const lastLink = await Link.findOne({
      user: req.user.userId,
    }).sort({ order: -1 });

    const nextOrder = lastLink ? lastLink.order + 1 : 0;

    const link = await Link.create({
      user: req.user.userId,
      title: cleanTitle,
      url: cleanUrl,
      isActive: true,
      order: nextOrder,
    });

    res.status(201).json({
      success: true,
      message: "Link created successfully",
      link,
    });
  } catch (error) {
    console.error("Create link error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// UPDATE LINK
// ========================================

const updateLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, isActive } = req.body;

    const link = await Link.findOne({
      _id: id,
      user: req.user.userId,
    });

    if (!link) {
      return res.status(404).json({
        success: false,
        message: "Link not found",
      });
    }

    if (title !== undefined) {
      const cleanTitle = title.trim();

      if (!cleanTitle) {
        return res.status(400).json({
          success: false,
          message: "Title cannot be empty",
        });
      }

      link.title = cleanTitle;
    }

    if (url !== undefined) {
      const cleanUrl = url.trim();

      if (!cleanUrl) {
        return res.status(400).json({
          success: false,
          message: "URL cannot be empty",
        });
      }

      link.url = cleanUrl;
    }

    if (isActive !== undefined) {
      link.isActive = Boolean(isActive);
    }

    await link.save();

    res.status(200).json({
      success: true,
      message: "Link updated successfully",
      link,
    });
  } catch (error) {
    console.error("Update link error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// DELETE LINK
// ========================================

const deleteLink = async (req, res) => {
  try {
    const { id } = req.params;

    const link = await Link.findOneAndDelete({
      _id: id,
      user: req.user.userId,
    });

    if (!link) {
      return res.status(404).json({
        success: false,
        message: "Link not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Link deleted successfully",
    });
  } catch (error) {
    console.error("Delete link error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// REORDER LINKS
// ========================================

const reorderLinks = async (req, res) => {
  try {
    const { links } = req.body;

    if (!Array.isArray(links)) {
      return res.status(400).json({
        success: false,
        message: "Links must be an array",
      });
    }

    for (let i = 0; i < links.length; i++) {
      await Link.findOneAndUpdate(
        {
          _id: links[i].id,
          user: req.user.userId,
        },
        {
          order: i,
        }
      );
    }

    const updatedLinks = await Link.find({
      user: req.user.userId,
    }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      message: "Links reordered successfully",
      links: updatedLinks,
    });
  } catch (error) {
    console.error("Reorder links error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getMyLinks,
  createLink,
  updateLink,
  deleteLink,
  reorderLinks,
};