"use strict";

const student = {
  id: 101,
  name: "Ali",
  marks: 0,
  scholarship: false,
  address: {
    city: "Islamabad",
    sector: "F-10",
  },
  contact: {
    email: "ali@university.edu.pk",
  },
};

const update = {
  name: "Ali Khan",
  address: {
    city: "Rawalpindi",
  },
  contact: {
    phone: "03001234567",
  },
};

function updateProfile(original, changes = {}) {
  if (
    !original ||
    typeof original !== "object" ||
    !changes ||
    typeof changes !== "object"
  ) {
    throw new TypeError("Objects required");
  }

  const {
    address: oldAddress = {},
    contact: oldContact = {},
    ...otherOld
  } = original;

  const { address: newAddress, contact: newContact, ...otherChanges } = changes;

  const { city: previousCity = "Unknown" } = oldAddress;

  const { city: requestedCity = previousCity } = newAddress ?? {};

  const city = requestedCity;

  const mergedAddress = {
    ...oldAddress,
    ...(newAddress ?? {}),
    city,
  };

  const mergedContact = {
    ...oldContact,
    ...(newContact ?? {}),
  };

  return {
    ...otherOld,
    ...otherChanges,
    address: mergedAddress,
    contact: mergedContact,
  };
}

function firstAndRest([first, ...rest] = []) {
  return { first, rest };
}

function addTags(...tags) {
  return tags.filter((tag) => typeof tag === "string");
}

const updated = updateProfile(student, update);

console.log("ORIGINAL STUDENT");
console.log(student);

console.log("UPDATED STUDENT");
console.log(updated);

console.log("REFERENCE COMPARISON");

console.log({
  student: student === updated,
  address: student.address === updated.address,
  contact: student.contact === updated.contact,
});

console.log("Email:", updated.contact?.email ?? "No email");

console.log("Array Destructuring:", firstAndRest(["FSWD", "OS", "AI"]));

console.log("Rest Parameters:", addTags("active", "scholarship"));

const falsyTest = updateProfile(student, {
  name: "",
  marks: 0,
  scholarship: false,
});

console.log("FALSY VALUE TEST");
console.log(falsyTest);

console.log(
  "ORIGINAL OBJECT UNCHANGED:",
  student.name === "Ali" && student.address.city === "Islamabad",
);
