const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

let services = [];

// Get all services
app.get("/api/services", (req, res) => {
    res.json(services);
});

// Add new service
app.post("/api/services", (req, res) => {

    const serviceCost = Number(req.body.serviceCost) || 0;
    const labourCost = Number(req.body.labourCost) || 0;

    const newService = {
        id: Date.now(),

        customer: req.body.customer,
        phone: req.body.phone,

        vehicle: req.body.vehicle,
        model: req.body.model,

        serviceType: req.body.serviceType,
        description: req.body.description,

        serviceCost: serviceCost,
        labourCost: labourCost,

        total: serviceCost + labourCost,

        status: "Pending",
        payment: "Pending"
    };

    services.push(newService);

    res.json({
        success: true,
        message: "Service added successfully",
        service: newService
    });
});

// Update service
app.put("/api/services/:id", (req, res) => {

    const id = Number(req.params.id);

    const service = services.find(item => item.id === id);

    if (!service) {
        return res.status(404).json({
            success: false,
            message: "Service not found"
        });
    }

    if (req.body.status) {
        service.status = req.body.status;
    }

    if (req.body.payment) {
        service.payment = req.body.payment;
    }

    res.json({
        success: true,
        service: service
    });
});

// Delete service
app.delete("/api/services/:id", (req, res) => {

    const id = Number(req.params.id);

    services = services.filter(item => item.id !== id);

    res.json({
        success: true,
        message: "Service deleted successfully"
    });
});

// Start server
app.listen(PORT, () => {

    console.log(
        `Vehicle Service Management System running at http://localhost:${PORT}`
    );

});