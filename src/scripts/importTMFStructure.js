// scripts/importTMFStructure.js
require('dotenv').config();
const mongoose = require('mongoose');
const { TMFStructure, Zone, Section, Artifact } = require('../models/Tmf');
const tmfStructureData = require('../data/tmf_structure.json');

const importTMFStructure = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/testing");
    console.log('MongoDB Connected...');

    // Create a new TMF structure
    const newTMFStructure = new TMFStructure({
      version: `${Date.now()}`,
      structure: tmfStructureData
    });
    
    await newTMFStructure.save();
    console.log('TMF structure imported successfully');
    
    // Create zones, sections, and artifacts from the structure
    for (const zone of tmfStructureData) {
      await Zone.findOneAndUpdate(
        { zoneId: zone.id },
        { zoneId: zone.id, name: zone.name },
        { upsert: true, new: true }
      );
      console.log(`Zone created: ${zone.id} - ${zone.name}`);
      
      if (zone.sections) {
        for (const section of zone.sections) {
          await Section.findOneAndUpdate(
            { sectionId: section.id },
            { sectionId: section.id, name: section.name, zoneId: zone.id },
            { upsert: true, new: true }
          );
          console.log(`Section created: ${section.id} - ${section.name}`);
          
          if (section.artifacts) {
            for (const artifact of section.artifacts) {
              await Artifact.findOneAndUpdate(
                { artifactId: artifact.id },
                { 
                  artifactId: artifact.id, 
                  name: artifact.name, 
                  sectionId: section.id
                },
                { upsert: true, new: true }
              );
              console.log(`Artifact created: ${artifact.id} - ${artifact.name}`);
            }
          }
        }
      }
    }
    
    console.log('Import complete!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importTMFStructure();

// module.exports = importTMFStructure;