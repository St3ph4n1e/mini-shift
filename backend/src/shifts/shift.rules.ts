export function shiftsOverlap(
  existingStart: Date,
  existingEnd: Date,
  newStart: Date,
  newEnd: Date,
) {
  return existingStart < newEnd && existingEnd > newStart;
}
