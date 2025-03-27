const mongoose = require('mongoose');

// Zone Schema - Based on DIA TMF Reference Model zones
const ZoneSchema = new mongoose.Schema({
  zoneNumber: { type: Number, required: true, unique: true },
  zoneName: { type: String, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Zone = mongoose.model('Zone', ZoneSchema);

// Section Schema - Based on DIA TMF Reference Model sections
const SectionSchema = new mongoose.Schema({
  sectionNumber: { type: String, required: true },
  sectionName: { type: String, required: true },
  description: { type: String },
  zone: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone', required: true },
  isRequired: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Create compound index for unique section numbers within a zone
SectionSchema.index({ sectionNumber: 1, zone: 1 }, { unique: true });
const Section = mongoose.model('Section', SectionSchema);

// Artifact Schema - Based on DIA TMF Reference Model artifacts
const ArtifactSchema = new mongoose.Schema({
  artifactNumber: { type: String, required: true },
  artifactName: { type: String, required: true },
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  ichCode: { type: String }, // ICH reference if applicable
  artifactSubcategory: { type: String }, // Further categorization if needed
  description: { type: String },
  isRequired: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Create compound index for unique artifact numbers within a section
ArtifactSchema.index({ artifactNumber: 1, section: 1 }, { unique: true });
const Artifact = mongoose.model('Artifact', ArtifactSchema);

// SubArtifact Schema - For further categorization of artifacts
const SubArtifactSchema = new mongoose.Schema({
  subArtifactNumber: { type: String, required: true },
  subArtifactName: { type: String, required: true },
  artifact: { type: mongoose.Schema.Types.ObjectId, ref: 'Artifact', required: true },
  description: { type: String },
  isRequired: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  metadata: {
    placeholders: [{ type: String }], // Placeholder variables for document templates
    lifecycle: { type: String, enum: ['Draft', 'Review', 'Approved', 'Archived'], default: 'Draft' }
  }
}, { timestamps: true });

// Create compound index for unique subArtifact numbers within an artifact
SubArtifactSchema.index({ subArtifactNumber: 1, artifact: 1 }, { unique: true });
const SubArtifact = mongoose.model('SubArtifact', SubArtifactSchema);






// // Document Schema - For actual document instances in the TMF
// const DocumentSchema = new mongoose.Schema({
//   documentId: { type: String, required: true, unique: true },
//   documentTitle: { type: String, required: true },
//   documentType: { type: String, required: true },
  
//   // References to classification hierarchy
//   artifact: { type: mongoose.Schema.Types.ObjectId, ref: 'Artifact', required: true },
//   subArtifact: { type: mongoose.Schema.Types.ObjectId, ref: 'SubArtifact' },
  
//   // Document version tracking (similar to Veeva Vault)
//   majorVersion: { type: Number, default: 0 },
//   minorVersion: { type: Number, default: 1 },
  
//   // Document metadata
//   documentDate: { type: Date, default: Date.now },
//   effectiveDate: { type: Date },
//   expirationDate: { type: Date },
//   status: { type: String, enum: ['Draft', 'In Review', 'Approved', 'Effective', 'Superseded', 'Withdrawn', 'Archived'], default: 'Draft' },
  
//   // Document content and storage
//   fileLocation: { type: String }, // Path or reference to stored file
//   fileFormat: { type: String }, // PDF, DOCX, etc.
//   fileSize: { type: Number }, // In bytes
  
//   // Workflow and lifecycle
//   lifecycle: {
//     currentStage: { type: String, default: 'Draft' },
//     history: [{
//       stage: { type: String },
//       changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//       changedDate: { type: Date, default: Date.now },
//       comments: { type: String }
//     }]
//   },
  
//   // Veeva Vault-like attributes
//   properties: {
//     studyId: { type: String },
//     siteId: { type: String },
//     countryCode: { type: String },
//     sponsorId: { type: String },
//     product: { type: String },
//     indication: { type: String },
//     customFields: { type: Map, of: mongoose.Schema.Types.Mixed }
//   },
  
//   // Access control
//   accessLevel: { type: String, enum: ['Public', 'Restricted', 'Confidential'], default: 'Restricted' },
//   owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
//   // Audit trail
//   isActive: { type: Boolean, default: true },
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
// }, { timestamps: true });

// const Document = mongoose.model('Document', DocumentSchema);




// Document Schema - For actual document instances in the TMF
const DocumentSchema = new mongoose.Schema({
  documentId: { type: String, required: true, unique: true },
  documentTitle: { type: String, required: true },
  documentType: { type: String, required: true },
  
  // References to classification hierarchy
  zone: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone' },
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
  artifact: { type: mongoose.Schema.Types.ObjectId, ref: 'Artifact' },
  subArtifact: { type: mongoose.Schema.Types.ObjectId, ref: 'SubArtifact' },
  
  version: { type: String, required: true },
  documentDate: { type: Date, default: Date.now },
  expirationDate: { type: Date },
  status: { type: String, enum: ['Draft', 'In Review', 'Approved', 'Effective', 'Superseded', 'Withdrawn', 'Archived'], default: 'Draft' },
  
  fileLocation: { type: String }, 
  fileFormat: { type: String }, 
  fileSize: { type: Number },
  fileUrl: { type: String },
  fileName: { type: String },

  study: { type: String },
  site: { type: String },
  country: { type: String },
 
  accessLevel: { type: String, enum: ['Public', 'Restricted', 'Confidential'], default: 'Restricted' },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  indication: { type: String },

}, { timestamps: true });

const Document = mongoose.model('Document', DocumentSchema);

module.exports = {
  Zone,
  Section,
  Artifact,
  SubArtifact,
  Document
};