
// In-memory storage for demonstration purposes
let customers = [];

export default function handler(req, res) {
  if (req.method === "POST") {
    const { name } = req.body;

    // Validate the input
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Customer name is required." });
    }

    // Create a new customer object
    const newCustomer = {
      id: Date.now(), // Simple unique ID based on timestamp
      name: name.trim(),
    };

    // Save the new customer
    customers.push(newCustomer);

    // Respond with a success message and the created customer
    return res.status(201).json({
      message: "Customer created successfully.",
      data: newCustomer,
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }
}
