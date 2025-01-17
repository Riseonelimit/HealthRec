//Included Models
const User = require('../models/user.model.js')
const Perm = require('../models/perm.model.js')
const Record = require('../models/reco.model.js')
const Presc = require('../models/presc.model.js')
const asynchandler = require('../utils/asynchandler.js')
const apierror = require('../utils/apierror.js')
const apiresponse = require('../utils/apiresponse.js')

const getBasicInfo = asynchandler(async(req,res)=>{
    const user = req.user
    const basicInfo = await Record.findOne({
        pid:user._id
    }).select('fullName dateOfBirth gender bloodGroup phoneNumber address maritialStatus ethinicityRace smokingAlcohol')
    if(!basicInfo){
        throw new apierror(404,"No Basic Info Found! ERR:record.controller.l14")
    }
    return res.status(200)
        .json(new apiresponse(200, basicInfo, "Basic Info Fetched Successfully!"))
})

const getMedicalHistory = asynchandler(async(req,res)=>{
    const user = req.user
    const medicalHistory = await Record.findOne({
        pid:user._id
    }).select('medicalHistory familyMedicalHistory allergies immunizationHistory surgeriesUndergone')
    if(!medicalHistory){
        throw new apierror(404,"No Medical History Found! ERR:record.controller.l26")
    }
    return res.status(200)
        .json(new apiresponse(200, medicalHistory, "Medical History Fetched Successfully!"))
})

const getVitals = asynchandler(async(req,res)=>{
    const user = req.user
    const vitals = await Record.findOne({
        pid:user._id
    }).select('heightInCm weightInKg LastBloodPressureInMmHg LastHeartRateInBpm')
    if(!vitals){
        throw new apierror(404,"No Vitals Found! ERR:record.controller.l38")
    }
    return res.status(200)
        .json(new apiresponse(200, vitals, "Vitals Fetched Successfully!"))
})

const getInsuranceInfo = asynchandler(async(req,res)=>{
    const user = req.user
    const insuranceInfo = await Record.findOne({
        pid:user._id
    }).select('insuranceProvider insurancePolicyNumber')
    if(!insuranceInfo){
        throw new apierror(404,"No Insurance Info Found! ERR:record.controller.l50")
    }
    return res.status(200)
        .json(new apiresponse(200, insuranceInfo, "Insurance Info Fetched Successfully!"))
})

const getEmergencyContact = asynchandler(async(req,res)=>{
    const user = req.user
    const emergencyContact = await Record.findOne({
        pid:user._id
    }).select('emergencyContactPhone')
    if(!emergencyContact){
        throw new apierror(404,"No Emergency Contact Found! ERR:record.controller.l62")
    }
    return res.status(200)
        .json(new apiresponse(200, emergencyContact, "Emergency Contact Fetched Successfully!"))
})

const getVisitHistory = asynchandler(async(req,res)=>{
    const user = req.user
    const prescobjid = await Record.findOne({
        pid:user._id
    }).select('visitHistory')
    if(!prescobjid){
        throw new apierror(404,"No Visit History Found! ERR:record.controller.l75")
    }
    const visitHistory = []
    for(let i=0;i<prescobjid.visitHistory.length;i++){
        const visit = await Presc.findById(prescobjid.visitHistory[i])
        visitHistory.push(visit)
    }
    return res.status(200)
        .json(new apiresponse(200, visitHistory, "Visit History Fetched Successfully!"))
})

const upBasicInfo = asynchandler(async(req,res)=>{
    const user = req.user
    const updateData = {
        fullName: req.body.fullName || undefined,
        dateOfBirth: req.body.dateOfBirth || undefined,
        gender: req.body.gender || undefined,
        bloodGroup: req.body.bloodGroup || undefined,
        phoneNumber: req.body.phoneNumber || undefined,
        address: req.body.address || undefined,
        maritalStatus: req.body.maritalStatus || undefined,
        ethnicityRace: req.body.ethnicityRace || undefined,
        smokingAlcohol: req.body.smokingAlcohol || undefined,
        insuranceProvider: req.body.insuranceProvider || undefined,
        insurancePolicyNumber: req.body.insurancePolicyNumber || undefined,
    }
    const filteredUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([key, value]) => value !== undefined)
    )
    const fullNameRegex = /^[a-zA-Z\s]{3,64}$/
    const dateOfBirthRegex = /^\d{4}-\d{2}-\d{2}$/
    //Date Format : "2024-11-17"
    const genderRegex = /^(Male|Female|Other)$/
    const bloodGroupRegex = /^(A|B|AB|O)[+-]$/
    const phoneNumberRegex = /^\d{10}$/
    const addressRegex = /^[a-zA-Z0-9\s,.'-]{3,256}$/
    const maritalStatusRegex = /^(Single|Married|Divorced)$/
    const raceRegex = /^[a-zA-Z\s]{3,64}$/
    const smokingAlcoholRegex = /^(Smoke|Alcohol|Both|Clean)$/
    if(filteredUpdateData.fullName && !fullNameRegex.test(filteredUpdateData.fullName))
        throw new apierror(400,"Invalid Full Name! ERR:record.controller.l116")
    if(filteredUpdateData.dateOfBirth && !dateOfBirthRegex.test(filteredUpdateData.dateOfBirth))
        throw new apierror(400,"Invalid Date of Birth! ERR:record.controller.l118")
    if(filteredUpdateData.gender && !genderRegex.test(filteredUpdateData.gender))
        throw new apierror(400,"Invalid Gender! ERR:record.controller.l120")
    if(filteredUpdateData.bloodGroup && !bloodGroupRegex.test(filteredUpdateData.bloodGroup))
        throw new apierror(400,"Invalid Blood Group! ERR:record.controller.l122")
    if(filteredUpdateData.phoneNumber && !phoneNumberRegex.test(filteredUpdateData.phoneNumber))
        throw new apierror(400,"Invalid Phone Number! ERR:record.controller.l124")
    if(filteredUpdateData.address && !addressRegex.test(filteredUpdateData.address))
        throw new apierror(400,"Invalid Address! ERR:record.controller.l126")
    if(filteredUpdateData.maritalStatus && !maritalStatusRegex.test(filteredUpdateData.maritalStatus))
        throw new apierror(400,"Invalid Marital Status! ERR:record.controller.l128")
    if(filteredUpdateData.ethnicityRace && !raceRegex.test(filteredUpdateData.ethnicityRace))
        throw new apierror(400,"Invalid Ethicity/Race! ERR:record.controller.l130")
    if(filteredUpdateData.smokingAlcohol && !smokingAlcoholRegex.test(filteredUpdateData.smokingAlcohol))
        throw new apierror(400,"Invalid Smoking/Alcohol! ERR:record.controller.l132")
    if(filteredUpdateData.insuranceProvider && !fullNameRegex.test(filteredUpdateData.insuranceProvider))
        throw new apierror(400,"Invalid Insurance Provider! ERR:record.controller.l134")
    const checkExists = await Record.findOne({
        pid:user._id
    })
    if(!checkExists){
        const record = await Record.create({
            ...filteredUpdateData,
            pid: user._id
        });
        if(!record){
            throw new apierror(500,"Error Creating Record! ERR:record.controller.l138")
        }
        return res.status(201)
            .json(new apiresponse(201,record,"Record Created Successfully!"))
    }else{
        const record = await Record.findOneAndUpdate({
            pid:user._id
        },{
            ...filteredUpdateData
        },{
            new:true
        })
        if(!record){
            throw new apierror(500,"Error Updating Record! ERR:record.controller.l151")
        }
        return res.status(200)
            .json(new apiresponse(200,record,"Record Updated Successfully!"))
    }
})

const upMedicalHistory = asynchandler(async(req,res)=>{
    if(!req.user.isDoctor)
        throw new apierror(401,"Unauthorized Access! ERR:record.controller.l162")
    const {patid} = req.body
    if(!patid)
        throw new apierror(400,"Patient ID Required! ERR:record.controller.l165")
    const user = await User.findById(patid).select("name")
    if(!user)
        throw new apierror(404,"Patient Not Found! ERR:record.controller.l168")
    const checkPerm = await Perm.findOne({
        doctor: req.user._id,
        patient: patid
    })
    if(!checkPerm)
        throw new apierror(401,"Unauthorized Access! ERR:record.controller.l174")
    const updateData = {
        medicalHistory: req.body.medicalHistory || undefined,
        familyMedicalHistory: req.body.familyMedicalHistory || undefined,
        allergies: req.body.allergies || undefined,
        immunizationHistory: req.body.immunizationHistory || undefined,
        surgeriesUndergone: req.body.surgeriesUndergone || undefined
    }
    const filteredUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([key, value]) => value !== undefined)
    )
    const basicRegex = /^[a-zA-Z\s]{3,64}$/
    if(filteredUpdateData.medicalHistory && !basicRegex.test(filteredUpdateData.medicalHistory))
        throw new apierror(400,"Invalid Medical History! ERR:record.controller.l187")
    if(filteredUpdateData.familyMedicalHistory && !basicRegex.test(filteredUpdateData.familyMedicalHistory))
        throw new apierror(400,"Invalid Family Medical History! ERR:record.controller.l189")
    if(filteredUpdateData.allergies && !basicRegex.test(filteredUpdateData.allergies))
        throw new apierror(400,"Invalid Allergies! ERR:record.controller.l191")
    if(filteredUpdateData.immunizationHistory && !basicRegex.test(filteredUpdateData.immunizationHistory))
        throw new apierror(400,"Invalid Immunization History! ERR:record.controller.l193")
    if(filteredUpdateData.surgeriesUndergone && !basicRegex.test(filteredUpdateData.surgeriesUndergone))
        throw new apierror(400,"Invalid Surgeries Undergone! ERR:record.controller.l195")
    const checkExists = await Record.findOne({
        pid:user._id
    })
    if(!checkExists){
        const record = await Record.create({
            ...filteredUpdateData,
            pid: user._id
        });
        if(!record){
            throw new apierror(500,"Error Creating Record! ERR:record.controller.l199")
        }
        return res.status(201)
            .json(new apiresponse(201,record,"Record Created Successfully!"))
    }else{
        for (const [key, value] of Object.entries(filteredUpdateData)) {
            if (checkExists[key]) {
                if (Array.isArray(checkExists[key])) {
                    if (!checkExists[key].includes(value)) {
                        checkExists[key].push(value)
                    }
                } else {
                    checkExists[key] = [checkExists[key], value];
                }
            } else {
                checkExists[key] = [value];
            }
        }
        await checkExists.save();
        return res.status(200)
            .json(new apiresponse(200,checkExists,"Record Updated Successfully!"))
    }
})

const getPatientList = asynchandler(async(req,res)=>{
    //This method is for Doctor who wants to see patient info linked to him
    const user = req.user
    if(!user.isDoctor){
        throw new apierror(401,"Unauthorized Access! ERR:record.controller.l233")
    }
    const patients = await Perm.find({
        doctor: user._id
    }).select("patient")
    if(!patients){
        throw new apierror(404,"No Patients Found! ERR:record.controller.l239")
    }
    return res.status(200)
        .json(new apiresponse(200,patients,"Patients Fetched Successfully!"))
})

const getPatientBasicInfo = asynchandler(async(req,res)=>{
    //Method for doctors to view patient's basic info
    const user = req.user
    if(!user.isDoctor){
        throw new apierror(401,"Unauthorized Access! ERR:record.controller.l249")
    }
    const {patid} = req.body
    if(!patid){
        throw new apierror(400,"Patient ID Required! ERR:record.controller.l254")
    }
    const checkPerm = await Perm.findOne({
        doctor: user._id,
        patient: patid
    })
    if(!checkPerm){
        throw new apierror(401,"Unauthorized Access! ERR:record.controller.l260")
    }
    const basicInfo = await Record.findOne({
        pid: patid
    }).select('fullName dateOfBirth gender bloodGroup phoneNumber address maritialStatus ethinicityRace smokingAlcohol')
    console.log(basicInfo)
    if(!basicInfo){
        throw new apierror(404,"No Basic Info Found! ERR:record.controller.l267")
    }
    return res.status(200)
        .json(new apiresponse(200, basicInfo, "Basic Info Fetched Successfully!"))
})

const getPatientMedicalHistory = asynchandler(async(req,res)=>{
    //Method for doctors to view patient's medical history
    const {patid} = req.body
    if(!patid){
        throw new apierror(400,"Patient ID Required! ERR:record.controller.l277")
    }
    if(!req.user.isDoctor){
        throw new apierror(401,"Unauthorized Access! ERR:record.controller.l280")
    }
    const checkPerm = await Perm.findOne({
        doctor: req.user._id,
        patient: patid
    })
    if(!checkPerm){
        throw new apierror(401,"Unauthorized Access! ERR:record.controller.l287")
    }
    const medicalHistory = await Record.findOne({
        pid: patid
    }).select('medicalHistory familyMedicalHistory allergies immunizationHistory surgeriesUndergone')
    if(!medicalHistory){
        throw new apierror(404,"No Medical History Found! ERR:record.controller.l293")
    }
    return res.status(200)
        .json(new apiresponse(200, medicalHistory, "Medical History Fetched Successfully!"))
})

const getPatientVitals = asynchandler(async(req,res)=>{
    //Method for doctors to view patient's vitals
    const {patid} = req.body
    if(!patid){
        throw new apierror(400,"Patient ID Required! ERR:record.controller.l303")
    }
    if(!req.user.isDoctor){
        throw new apierror(401,"Unauthorized Access! ERR:record.controller.l306")
    }
    const checkPerm = await Perm.findOne({
        doctor: req.user._id,
        patient: patid
    })
    if(!checkPerm){
        throw new apierror(401,"Unauthorized Access! ERR:record.controller.l313")
    }
    const vitals = await Record.findOne({
        pid: patid
    }).select('heightInCm weightInKg LastBloodPressureInMmHg LastHeartRateInBpm')
    if(!vitals){
        throw new apierror(404,"No Vitals Found! ERR:record.controller.l319")
    }
    return res.status(200)
        .json(new apiresponse(200, vitals, "Vitals Fetched Successfully!"))
})

const getPatientInsuranceInfo = asynchandler(async(req,res)=>{
    //Method for doctors to view patient's insurance info
    const {patid} = req.body
    if(!patid){
        throw new apierror(400,"Patient ID Required! ERR:record.controller.l329")
    }
    if(!req.user.isDoctor){
        throw new apierror(401,"Unauthorized Access! ERR:record.controller.l332")
    }
    const checkPerm = await Perm.findOne({
        doctor: req.user._id,
        patient: patid
    })
    if(!checkPerm){
        throw new apierror(401,"Unauthorized Access! ERR:record.controller.l339")
    }
    const insuranceInfo = await Record.findOne({
        pid: patid
    }).select('insuranceProvider insurancePolicyNumber')
    if(!insuranceInfo){
        throw new apierror(404,"No Insurance Info Found! ERR:record.controller.l345")
    }
    return res.status(200)
        .json(new apiresponse(200, insuranceInfo, "Insurance Info Fetched Successfully!"))
})

const getPatientEmergencyContact = asynchandler(async(req,res)=>{
    //Method for doctors to view patient's emergency contact
    const {patid} = req.body
    if(!patid){
        throw new apierror(400,"Patient ID Required! ERR:record.controller.l355")
    }
    if(!req.user.isDoctor){
        throw new apierror(401,"Unauthorized Access! ERR:record.controller.l358")
    }
    const checkPerm = await Perm.findOne({
        doctor: req.user._id,
        patient: patid
    })
    if(!checkPerm){
        throw new apierror(401,"Unauthorized Access! ERR:record.controller.l365")
    }
    const emergencyContact = await Record.findOne({
        pid: patid
    }).select('emergencyContactPhone')
    if(!emergencyContact){
        throw new apierror(404,"No Emergency Contact Found! ERR:record.controller.l371")
    }
    return res.status(200)
        .json(new apiresponse(200, emergencyContact, "Emergency Contact Fetched Successfully!"))
})

const getPatientVisitHistory = asynchandler(async(req,res)=>{
    //Method for doctors to view patient's visit history
    const {patid} = req.body
    if(!patid){
        throw new apierror(400,"Patient ID Required! ERR:record.controller.l381")
    }
    if(!req.user.isDoctor){
        throw new apierror(401,"Unauthorized Access! ERR:record.controller.l384")
    }
    const checkPerm = await Perm.findOne({
        doctor: req.user._id,
        patient: patid
    })
    if(!checkPerm){
        throw new apierror(401,"Unauthorized Access! ERR:record.controller.l391")
    }
    const prescobjid = await Record.findOne({
        pid: patid
    }).select('visitHistory')
    if(!prescobjid){
        throw new apierror(404,"No Visit History Found! ERR:record.controller.l397")
    }
    const visitHistory = []
    for(let i=0;i<prescobjid.visitHistory.length;i++){
        const visit = await Presc.findById(prescobjid.visitHistory[i])
        visitHistory.push(visit)
    }
    return res.status(200)
        .json(new apiresponse(200, visitHistory, "Visit History Fetched Successfully!"))
})

const upPatientVitals = asynchandler(async (req,res)=>{
    if(!req.user.isDoctor)
        throw new apierror(401,"Unauthorized Access! ERR:record.controller.l162")
    const {patid} = req.body
    if(!patid)
        throw new apierror(400,"Patient ID Required! ERR:record.controller.l165")
    const user = await User.findById(patid).select("name")
    if(!user)
        throw new apierror(404,"Patient Not Found! ERR:record.controller.l168")
    const checkPerm = await Perm.findOne({
        doctor: req.user._id,
        patient: patid
    })
    if(!checkPerm)
        throw new apierror(401,"Unauthorized Access! ERR:record.controller.l174")
    const updateData = {
        heightInCm: req.body.heightInCm || undefined,
        weightInKg: req.body.weightInKg || undefined,
        LastBloodPressureInMmHg: req.body.LastBloodPressureInMmHg || undefined,
        LastHeartRateInBpm: req.body.LastHeartRateInBpm || undefined
    }
    const filteredUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([key, value]) => value !== undefined)
    )
    const heInCmRegex = /^\d{3}$/
    const weInKgRegex = /^\d{2,3}$/
    const bpRegex = /^\d{2,3}\/\d{2,3}$/
    const hrRegex = /^\d{2,3}$/
    if(filteredUpdateData.heightInCm && !heInCmRegex.test(filteredUpdateData.heightInCm))
        throw new apierror(400,"Invalid Height! ERR:record.controller.l437")
    if(filteredUpdateData.weightInKg && !weInKgRegex.test(filteredUpdateData.weightInKg))
        throw new apierror(400,"Invalid Weight! ERR:record.controller.l439")
    if(filteredUpdateData.LastBloodPressureInMmHg && !bpRegex.test(filteredUpdateData.LastBloodPressureInMmHg))
        throw new apierror(400,"Invalid Blood Pressure! ERR:record.controller.l441")
    if(filteredUpdateData.LastHeartRateInBpm && !hrRegex.test(filteredUpdateData.LastHeartRateInBpm))
        throw new apierror(400,"Invalid Heart Rate! ERR:record.controller.l443")
    const checkExists = await Record.findOne({
        pid:user._id
    })
    if(!checkExists){
        const record = await Record.create({
            ...filteredUpdateData,
            pid: user._id
        });
        if(!record){
            throw new apierror(500,"Error Creating Record! ERR:record.controller.l447")
        }
        return res.status(201)
            .json(new apiresponse(201,record,"Record Created Successfully!"))
    }else{
        const record = await Record.findOneAndUpdate({
            pid:user._id
        },{
            ...filteredUpdateData
        },{
            new:true
        })
        return res.status(200)
            .json(new apiresponse(200,record,"Record Updated Successfully!"))
    }
})

const upEmergencyContact = asynchandler(async(req,res)=>{
    const user = req.user
    const {uname,uphone} = req.body
    if([uname,uphone].some((field)=>field===undefined|| typeof field !== 'string' || (field?.trim() === "")))
        throw new apierror(400,"Invalid Emergency Contact! ERR:record.controller.l478")
    const phoneRegex = /^\d{10}$/
    if(!phoneRegex.test(uphone))
        throw new apierror(400,"Invalid Phone Number! ERR:record.controller.l481")
    const checkExists = await Record.findOne({
        pid:user._id
    })
    if(!checkExists){
        const record = await Record.create({
            pid: user._id,
            emergencyContactPhone: [{
                name: uname,
                phone: uphone
            }]
        })
        return res.status(201)
            .json(new apiresponse(201,record,"Emergency Contact Created Successfully!"))
    }else{
        const record = await Record.findOneAndUpdate({
            pid:user._id
        },{
            $push: {
                emergencyContactPhone: {
                    name: uname,
                    phone: uphone
                }
            }
        },{new:true})
        return res.status(200)
            .json(new apiresponse(200,record,"Emergency Contact Updated Successfully!"))
    }
})

const upVisitHistory = asynchandler(async(req,res)=>{
    if(!req.user.isDoctor)
        throw new apierror(401,"Unauthorized Access! ERR:record.controller.l513")
    const {patid,illness,prescription} = req.body
    if(!patid || !illness || !prescription)
        throw new apierror(400,"Fields Required! ERR:record.controller.l516")
    const patient = await User.findById(patid)
    if(!patient)
        throw new apierror(404,"Patient Not Found! ERR:record.controller.l519")
    const checkPerm = await Perm.findOne({
        doctor: req.user._id,
        patient: patid
    })
    if(!checkPerm)
        throw new apierror(401,"Unauthorized Access! ERR:record.controller.l525")
    const checkExists = await Record.findOne({
        pid:patid
    })
    if(!checkExists){
        const pres = await Presc.create({
            doctor: req.user._id,
            illness: illness,
            prescription: prescription
        })
        if(!pres)
            throw new apierror(500,"Error Creating Prescription! ERR:record.controller.l536")
        const record = await Record.create({
            pid: patid,
            visitHistory: [pres._id]
        })
        if(!record)
            throw new apierror(500,"Error Creating Record! ERR:record.controller.l542")
        return res.status(201)
            .json(new apiresponse(201,record,"Record Created Successfully!"))
    }else{
        const pres = await Presc.create({
            doctor: req.user._id,
            illness: illness,
            prescription: prescription
        })
        if(!pres)
            throw new apierror(500,"Error Creating Prescription! ERR:record.controller.l552")
        checkExists.visitHistory.push(pres._id)
        await checkExists.save()
        return res.status(200)
            .json(new apiresponse(200,checkExists,"Record Updated Successfully!"))
    }
})

const getPresPhar = asynchandler(async(req,res)=>{
    if(!req.user.isPharmacist)
        throw new apierror(401,"Unauthorized Access! ERR:record.controller.l565")
    const checkPerms = await Perm.find({
        doctor: req.user._id
    })
    if(!checkPerms)
        throw new apierror(404,"No Permissions Found! ERR:record.controller.l570")
    const prescs = []
    for(let i=0;i<checkPerms.length;i++){
        const record = await Record.findOne({
            pid: checkPerms[i].patient
        })
        if(!record)
            throw new apierror(404,"No Record Found! ERR:record.controller.l576")
        for(let j=0;j<record.visitHistory.length;j++){
            const presc = await Presc.findById(record.visitHistory[j])
            prescs.push(presc)
        }
    }
    return res.status(200)
        .json(new apiresponse(200,prescs,"Prescriptions Fetched Successfully!"))
})

module.exports={
    getBasicInfo,
    getMedicalHistory,
    getVitals,
    getInsuranceInfo,
    getEmergencyContact,
    getVisitHistory,
    upBasicInfo,
    upMedicalHistory,
    upPatientVitals,
    getPatientList,
    getPatientBasicInfo,
    getPatientMedicalHistory,
    getPatientVitals,
    getPatientInsuranceInfo,
    getPatientEmergencyContact,
    getPatientVisitHistory,
    upEmergencyContact,
    upVisitHistory,
    getPresPhar
}