import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { image } = req.body; // This should be a file uploaded via form-data

    const apiKey = process.env.AZURE_VISION_API_KEY;
    const endpoint = process.env.AZURE_VISION_ENDPOINT;

    try {
      const response = await axios.post(
        `${endpoint}/analyze?api-version=3.2&visualFeatures=Tags`,
        image, // Sending binary image data directly
        {
          headers: {
            "Content-Type": "application/octet-stream", // Set the correct content type for binary data
            'Ocp-Apim-Subscription-Key': apiKey,
          },
        }
      );

      const labels = response.data.tags.map((tag) => tag.name);
      res.status(200).json({ ingredients: labels });
    } catch (error) {
      console.error(
        "Error making API request:",
        error.response ? error.response.data : error.message
      );
      res.status(500).json({ error: "Error detecting ingredients" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
