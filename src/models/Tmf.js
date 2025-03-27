// models/Artifact.js
const mongoose = require('mongoose');

const ArtifactSchema = new mongoose.Schema({
  artifactId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  files: [{
    filename: String,
    path: String,
    uploadDate: Date,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    version: Number,
    status: {
      type: String,
      enum: ['draft', 'in-review', 'approved', 'rejected'],
      default: 'draft'
    }
  }],
  metadata: {
    type: Map,
    of: String
  },
  sectionId: {
    type: String,
    required: true
  }
});

// models/Section.js
const SectionSchema = new mongoose.Schema({
  sectionId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  zoneId: {
    type: String,
    required: true
  }
});

// models/Zone.js
const ZoneSchema = new mongoose.Schema({
  zoneId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: String
});

// models/TMFStructure.js
const TMFStructureSchema = new mongoose.Schema({
  version: {
    type: String,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  structure: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
});

module.exports = {
  Artifact: mongoose.model('Artifact', ArtifactSchema),
  Section: mongoose.model('Section', SectionSchema),
  Zone: mongoose.model('Zone', ZoneSchema),
  TMFStructure: mongoose.model('TMFStructure', TMFStructureSchema)
};