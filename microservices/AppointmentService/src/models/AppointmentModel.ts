const Appointment = {
    fields: {
        appointment_id: Number,
        pet_id: Number,
        service_id: Number,
        staff_id: Number,
        appointment_date: Date,
        start_time: Date,
        end_time: Date,
        status: String,
        cancellation_reason: String,
        service_price: Number,
        created_at: Date,
        updated_at: Date
    }
    
}
export default Appointment;