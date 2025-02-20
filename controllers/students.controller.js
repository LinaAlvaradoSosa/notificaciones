import Student from "../models/students.model.js";

export async function createStudent(req, res) {
    const { name, email } = req.body;
    try {
        if (!name) return res.send('Student name is required');
        if (!email) return res.send('email is required')
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // expresiones regulares
        if(!emailRegex.test(email)) return res.send('Email no valido')
        
        const newStudent = new Student(req.body);
        await newStudent.save()
        res.status(201).json({of:true, newStudent})
    } catch (error) {
        console.log(error.message);
        res.status(500).send({error: 'Error, please contact with the admin'})
    }
}
export async function  getStudents(req, res) {
    try {
        const students = await Student.find();
        res.status(201).json({ok:true, students})
    } catch (error) {
        console.log(error.message);
        res.status(500).send({error: 'Error, please contact with the admin'})
    }
}
export async function getStudentById(req, res) {
    try {
        const { id } = req.params;
        const student = await Student.findById({_id:id}).populate('notifications')
        if(!student) return res.send('This student does not exist')
        res.status(201).json({ok:true, student})
    } catch (error) {
        console.log(error.message);
        res.status(500).send({error: 'Error, please contact with the admin'})
    }
}
export async function updatStudent(req, res) {

    const { id } = req.params;
    const { paymentsPending } = req.body;
    try {
        const student = await Student.findByIdAndUpdate(id, { paymentsPending: paymentsPending }, { new: true });
        res.json(`Student updated: ${student}`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



