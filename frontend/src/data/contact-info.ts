export const contactInfo = {
  companyName: "BST - Building Solutions Technology",
  phone: "+8801533827434",
  phoneDisplay: "01533827434",
  whatsapp: "+8801533827434",
  whatsappMessage: "Hello BST, I'd like to discuss my project",
  email: "mujahidislam2540@gmail.com",
  address: "Badda, Dhaka 1212, Bangladesh",
  addressParts: {
    streetAddress: "Badda",
    addressLocality: "Dhaka",
    postalCode: "1212",
    addressCountry: "BD",
  },
  coordinates: {
    lat: 23.7806,
    lng: 90.4254,
  },
  hours: {
    display: "Open 24/7, every day including Friday",
    schemaDays: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opensAt: "00:00",
    closesAt: "23:59",
  },
} as const;
