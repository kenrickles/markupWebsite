# Recovered Hugo content and Messages update

## Authoritative sources

- Repository: `Gmar1289/personalSite`
- Commit: `b0a70ff3b1c44ddf02b26b6f88e10b4b80f33802`
- Homepage configuration: https://github.com/Gmar1289/personalSite/blob/b0a70ff3b1c44ddf02b26b6f88e10b4b80f33802/config.toml
- Résumé: https://github.com/Gmar1289/personalSite/blob/b0a70ff3b1c44ddf02b26b6f88e10b4b80f33802/content/resume/index.md

The exact recovered résumé markdown is archived in `docs/sources/recovered-hugo-resume.md` for traceability. The introduction comes from the config: “Hello, I'm Kenrick” and “I desire to be a T-shaped problem solver and believe in paying it forward.” The existing GitHub, LinkedIn, Telegram, and email links agree with that config.

## Imported and reconciled content

- Restore Financial Adviser at Prudential, Swype, CEO mindPower Consultancy and the SMU Teaching Assistant role, with their original dates and achievement bullets.
- Restore the original Partior DevSecOps bullets, including Cobra CLI, smart-contract CI/CD, cloud-network deployments, and Vault/External Secrets integration.
- Retain later engineering roles already confirmed in the profile: Galaxy Digital (September 2025–present), Prudential SRE, and the later Partior senior role. The recovered snapshot's old `Partior … Present` date is bounded by the existing chronology rather than creating two current jobs.
- Restore the original education entries, with IE University as its own exchange entry. Keep the original degree wording for later user edits. The recovered Rocket Academy date says `Sep 2020 - April 2020`; use the already verified September 2020–April 2021 dates from the existing profile/2024 résumé instead of publishing an impossible interval.
- Restore CKA with its original September 2021 date and Credly verification link, scholarship detail, National Service Grade A, CID Director Awards and Commissioner of Police Commendation detail.
- Share this data across Notes and the printable résumé. Do not publish the private résumé PDF or its phone number.

## Selected Work removal

Remove the Selected Work note, folder shortcut, Finder-to-projects action, case-study data, case-study page route and sitemap entries. The four old case-study URLs now return the site's normal 404. Update the unused command palette's work jump to Experience. This removes the unsupported project stories and their outcome claims instead of simply hiding them behind another label.

## Messages

`AgentMessages.tsx` adapts the reference `app/desktop/apps/Messages.tsx` structure into a separate native-looking window. It retains conversation selection, a 224 px list, blue/grey bubbles, grouped sender labels, automatic latest-message scrolling, and list/thread navigation in compact windows. It adds close/minimize/restore, zoom, dragging, corner resizing, and focus stacking with Notes.

`src/lib/agentConversations.ts` contains four fictional, scripted exchanges: The agent group chat, Research Agent, Renovation Agent, and Deploy Agent. They are humor written for this portfolio, not real private transcripts or live AI integrations. The composer is disabled and the UI identifies the content as fictional. The mail icon and contact note retain real contact links.

Validation includes recovered copy and historical roles, Galaxy retention, certification links, obsolete route 404/sitemap removal, Notes navigation, Messages thread switching and minimize/restore, native panel geometry, compact layouts, blocked storage, reduced motion, and no-JavaScript résumé access.
