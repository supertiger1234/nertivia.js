type tplotOptions = {
  [key: string]: number
}
export const RolePermissions: tplotOptions = {
  ADMIN: 1,
  SEND_MESSAGES: 2,
  MANAGE_ROLES: 4,
  MANAGE_CHANNELS: 8,
  KICK_USER: 16,
  BAN_USER: 32
}
