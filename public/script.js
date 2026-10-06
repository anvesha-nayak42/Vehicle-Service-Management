let services = [];


// =====================================================
// SHOW SECTION
// =====================================================

function showSection(sectionId) {

    const sections =
        document.querySelectorAll(".section");


    sections.forEach(section => {

        section.classList.remove("active");

    });


    document
        .getElementById(sectionId)
        .classList.add("active");


    loadServices();

}



// =====================================================
// ADD SERVICE
// =====================================================

document
    .getElementById("serviceForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        const serviceData = {

            customer:
                document
                .getElementById("customer")
                .value,

            phone:
                document
                .getElementById("phone")
                .value,

            vehicle:
                document
                .getElementById("vehicle")
                .value,

            model:
                document
                .getElementById("model")
                .value,

            serviceType:
                document
                .getElementById("serviceType")
                .value,

            description:
                document
                .getElementById("description")
                .value,

            serviceCost:
                document
                .getElementById("serviceCost")
                .value,

            labourCost:
                document
                .getElementById("labourCost")
                .value

        };


        try {

            const response =
                await fetch("/api/services", {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(serviceData)

                });


            const data =
                await response.json();


            if (data.success) {

                document
                    .getElementById("formMessage")
                    .innerText =
                    "✓ Service added successfully!";


                document
                    .getElementById("serviceForm")
                    .reset();


                loadServices();

            }


        } catch (error) {

            console.error(error);

            document
                .getElementById("formMessage")
                .innerText =
                "Error adding service.";

        }

    });



// =====================================================
// LOAD SERVICES
// =====================================================

async function loadServices() {

    try {

        const response =
            await fetch("/api/services");


        services =
            await response.json();


        updateDashboard();

        displayServices();

        displayBilling();


    } catch (error) {

        console.error(
            "Unable to load services:",
            error
        );

    }

}



// =====================================================
// DASHBOARD
// =====================================================

function updateDashboard() {


    const customers =
        new Set(
            services.map(
                service =>
                    service.customer
            )
        );


    const vehicles =
        new Set(
            services.map(
                service =>
                    service.vehicle
            )
        );


    const pending =
        services.filter(
            service =>
                service.status === "Pending"
        );


    const completed =
        services.filter(
            service =>
                service.status === "Completed"
        );


    const revenue =
        services.reduce(

            (total, service) =>

                total +
                Number(service.total),

            0

        );


    document
        .getElementById("customerCount")
        .innerText =
        customers.size;


    document
        .getElementById("vehicleCount")
        .innerText =
        vehicles.size;


    document
        .getElementById("pendingCount")
        .innerText =
        pending.length;


    document
        .getElementById("completedCount")
        .innerText =
        completed.length;


    document
        .getElementById("revenue")
        .innerText =
        revenue;

}



// =====================================================
// DISPLAY SERVICE RECORDS
// =====================================================

function displayServices() {


    const table =
        document
        .getElementById("serviceTable");


    table.innerHTML = "";


    if (services.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="6"
                    style="text-align:center">

                    No service records found.

                </td>

            </tr>

        `;

        return;

    }


    services.forEach(service => {


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <strong>
                    ${service.customer}
                </strong>

                <br>

                <small>
                    ${service.phone}
                </small>

            </td>


            <td>

                ${service.vehicle}

                <br>

                <small>
                    ${service.model}
                </small>

            </td>


            <td>

                ${service.serviceType}

                <br>

                <small>
                    ${service.description}
                </small>

            </td>


            <td>

                ₹${service.total}

            </td>


            <td>

                <strong>
                    ${service.status}
                </strong>

            </td>


            <td>


                <button

                    class="status-btn pending"

                    onclick="
                    updateStatus(
                        ${service.id},
                        'Pending'
                    )">

                    Pending

                </button>


                <button

                    class="status-btn progress"

                    onclick="
                    updateStatus(
                        ${service.id},
                        'In Progress'
                    )">

                    In Progress

                </button>


                <button

                    class="status-btn completed"

                    onclick="
                    updateStatus(
                        ${service.id},
                        'Completed'
                    )">

                    Completed

                </button>


                <button

                    class="status-btn delete"

                    onclick="
                    deleteService(
                        ${service.id}
                    )">

                    Delete

                </button>


            </td>

        `;


        table.appendChild(row);

    });

}



// =====================================================
// UPDATE SERVICE STATUS
// =====================================================

async function updateStatus(id, status) {


    await fetch(
        `/api/services/${id}`,
        {

            method: "PUT",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body:
                JSON.stringify({
                    status: status
                })

        }
    );


    loadServices();

}



// =====================================================
// DELETE SERVICE
// =====================================================

async function deleteService(id) {


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this service?"
        );


    if (!confirmDelete) {

        return;

    }


    await fetch(
        `/api/services/${id}`,
        {

            method: "DELETE"

        }
    );


    loadServices();

}



// =====================================================
// BILLING
// =====================================================

function displayBilling() {


    const table =
        document
        .getElementById("billingTable");


    table.innerHTML = "";


    if (services.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="6"
                    style="text-align:center">

                    No billing records found.

                </td>

            </tr>

        `;

        return;

    }


    services.forEach(service => {


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                ${service.customer}

            </td>


            <td>

                ${service.vehicle}

            </td>


            <td>

                ₹${service.serviceCost}

            </td>


            <td>

                ₹${service.labourCost}

            </td>


            <td>

                <strong>
                    ₹${service.total}
                </strong>

            </td>


            <td>


                <button

                    class="status-btn payment"

                    onclick="
                    markPaid(
                        ${service.id}
                    )">

                    ${service.payment}

                </button>


            </td>

        `;


        table.appendChild(row);

    });

}



// =====================================================
// MARK PAYMENT AS PAID
// =====================================================

async function markPaid(id) {


    await fetch(
        `/api/services/${id}`,
        {

            method: "PUT",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body:
                JSON.stringify({
                    payment: "Paid"
                })

        }
    );


    loadServices();

}



// =====================================================
// INITIAL LOAD
// =====================================================

loadServices();