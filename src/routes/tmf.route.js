const express = require('express');
const router = express.Router();
const { Zone, Section, Artifact, SubArtifact, Document } = require('../models/TMF_Referece_Mode');


const upload = require("../config/multerConfig");
const { uploadToAzure } = require("../services/azureUpload");


// Generic async handler to catch errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Zone Routes
router.get('/zones', asyncHandler(async (req, res) => res.json(await Zone.find())));
router.get('/zones/:id', asyncHandler(async (req, res) => res.json(await Zone.findById(req.params.id))));
router.post('/zones', asyncHandler(async (req, res) => res.json(await Zone.create(req.body))));
router.put('/zones/:id', asyncHandler(async (req, res) => res.json(await Zone.findByIdAndUpdate(req.params.id, req.body, { new: true }))));
router.delete('/zones/:id', asyncHandler(async (req, res) => res.json(await Zone.findByIdAndDelete(req.params.id))));

// Section Routes
router.get('/zones/:zoneId/sections', asyncHandler(async (req, res) => res.json(await Section.find({ zone: req.params.zoneId }))));
router.get('/sections/:id', asyncHandler(async (req, res) => res.json(await Section.findById(req.params.id))));
router.post('/zones/:zoneId/sections', asyncHandler(async (req, res) => res.json(await Section.create({ ...req.body, zone: req.params.zoneId }))));
router.put('/sections/:id', asyncHandler(async (req, res) => res.json(await Section.findByIdAndUpdate(req.params.id, req.body, { new: true }))));
router.delete('/sections/:id', asyncHandler(async (req, res) => res.json(await Section.findByIdAndDelete(req.params.id))));

// Artifact Routes
router.get('/sections/:sectionId/artifacts', asyncHandler(async (req, res) => res.json(await Artifact.find({ section: req.params.sectionId }))));
router.get('/artifacts/:id', asyncHandler(async (req, res) => res.json(await Artifact.findById(req.params.id))));
router.post('/sections/:sectionId/artifacts', asyncHandler(async (req, res) => res.json(await Artifact.create({ ...req.body, section: req.params.sectionId }))));
router.put('/artifacts/:id', asyncHandler(async (req, res) => res.json(await Artifact.findByIdAndUpdate(req.params.id, req.body, { new: true }))));
router.delete('/artifacts/:id', asyncHandler(async (req, res) => res.json(await Artifact.findByIdAndDelete(req.params.id))));

// SubArtifact Routes
router.get('/artifacts/:artifactId/subartifacts', asyncHandler(async (req, res) => res.json(await SubArtifact.find({ artifact: req.params.artifactId }))));
router.get('/subartifacts/:id', asyncHandler(async (req, res) => res.json(await SubArtifact.findById(req.params.id))));
router.post('/artifacts/:artifactId/subartifacts', asyncHandler(async (req, res) => res.json(await SubArtifact.create({ ...req.body, artifact: req.params.artifactId }))));
router.put('/subartifacts/:id', asyncHandler(async (req, res) => res.json(await SubArtifact.findByIdAndUpdate(req.params.id, req.body, { new: true }))));
router.delete('/subartifacts/:id', asyncHandler(async (req, res) => res.json(await SubArtifact.findByIdAndDelete(req.params.id))));




// Document Routes
router.post("/documents/:userId", upload.single("file"), async (req, res) => {
  try {
      const { userId } = req.params;
      if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
      }

      // Upload file to Azure
      const fileUrl = await uploadToAzure(req.file.buffer, req.file.originalname, req.file.mimetype);

      console.log("File uploaded successfully:", req.file.originalname);
      console.log("File URL:", fileUrl);
      console.log("REQ BODY:", req.body);

      // Parse metadata from string to object
      const metadata = JSON.parse(req.body.metadata);

      console.log("Parsed Metadata:", metadata);

      // Save document metadata to MongoDB
      const document = new Document({
          documentId: metadata.documentId,
          documentTitle: metadata.documentTitle,
          documentType: metadata.documentType,
          version: metadata.version,
          zone: metadata.zone,
          section: metadata.section,
          artifact: metadata.artifact,
          subArtifact: metadata.subArtifact,
          status: metadata.status,
          accessLevel: metadata.accessLevel,
          documentDate: metadata.documentDate,
          effectiveDate: metadata.effectiveDate,
          expirationDate: metadata.expirationDate,
          study: metadata.study,
          site: metadata.site,
          country: metadata.country,
          indication: metadata.indication,
          fileName: req.file.originalname,
          fileSize: req.file.size,
          fileFormat: req.file.mimetype,
          fileUrl: fileUrl,
          createdBy: userId,
          lastModifiedBy: userId,
      });

      await document.save();

      res.status(201).json({ message: "Document uploaded successfully", document });
  } catch (error) {
      console.error("Error creating document:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});


router.get('/documents', asyncHandler(async (req, res) => {
  try {
      const documents = await Document.find()
          .populate({ path: 'createdBy', select: 'userName' })  // Fetch user's name
          .populate({ path: 'lastModifiedBy', select: 'userName' })  // Fetch last modifier's name
          .populate({ path: 'zone', select: 'zoneName' })  // Fetch Zone name
          .populate({ path: 'section', select: 'sectionName' })  // Fetch Section name
          .populate({ path: 'artifact', select: 'artifactName' })  // Fetch Artifact name
          .populate({ path: 'subArtifact', select: 'subArtifactName' }); // Fetch SubArtifact name
      
      res.json(documents);
  } catch (error) {
      console.error("❌ Error fetching documents:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
}));

// router.get('/documents/:id', asyncHandler(async (req, res) => res.json(await Document.findById(req.params.id))));
// router.put('/documents/:id', asyncHandler(async (req, res) => res.json(await Document.findByIdAndUpdate(req.params.id, req.body, { new: true }))));
// router.delete('/documents/:id', asyncHandler(async (req, res) => res.json(await Document.findByIdAndDelete(req.params.id))));

module.exports = router;
