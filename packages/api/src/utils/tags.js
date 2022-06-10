export function getTagValue (user, tagName, defaultValue) {
  return (
    user.tags?.find((tag) => tag.tag === tagName && !tag.deleted_at)?.value ||
    defaultValue
  )
}

export function hasTag (user, tagName, value) {
  return Boolean(
    user.tags?.find(
      (tag) => tag.tag === tagName && tag.value === value && !tag.deleted_at
    )
  )
}

export function hasPendingTagProposal (user, tagName) {
  return Boolean(
    user.tagProposals?.find(
      (proposal) =>
        proposal.tag === tagName &&
        !proposal.admin_decision_type &&
        !proposal.deleted_at
    )
  )
}
