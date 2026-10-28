/**
 * Site-wide constants, defined once. layout.tsx, the project pages, the
 * sitemap, robots, manifest, llms.txt and the social links all read from
 * here, so the canonical host, the contact address and the profile URLs can
 * never drift apart between files.
 */
export const SITE_URL = "https://www.tjcreate.co.uk";
export const SITE_NAME = "TJCreate · Toby Johnson";
export const SITE_TITLE = "Toby Johnson · Graphic & Motion Designer, Lincoln · TJCreate";
export const SITE_DESC =
  "Freelance graphic and motion designer in Lincoln, UK. Campaign artwork, lyric videos, motion graphics and 3D renders for brands, artists and agencies.";
export const CONTACT_EMAIL = "hello@tjcreate.co.uk";

// Schema.org @id anchors shared by every page's JSON-LD.
export const PERSON_ID = `${SITE_URL}/#toby`;
export const ORG_ID = `${SITE_URL}/#tjcreate`;
export const WEBSITE_ID = `${SITE_URL}/#site`;

// Canonical profile URLs: the form each platform redirects to, so a link and
// a sameAs entry never spend a hop. Used by SocialIcons and the JSON-LD.
export const LINKEDIN_URL = "https://www.linkedin.com/in/tobyjohnsoncreate/";
export const INSTAGRAM_URL = "https://www.instagram.com/tj.create/";
export const BEHANCE_URL = "https://www.behance.net/tobyjohnson5";
export const SOCIAL_URLS = [LINKEDIN_URL, INSTAGRAM_URL, BEHANCE_URL];

// Music profiles tie the designer to the musician Toby Johnson as one
// entity for name searches (Person.sameAs only, not the business).
export const MUSIC_PROFILE_URLS = [
  "https://open.spotify.com/artist/6aWiYkCceJsc6lorPBdvIg",
  "https://music.apple.com/gb/artist/toby-johnson/1326311341",
  "https://soundcloud.com/tobyjohnsonmusic",
  "https://tobyjohnsonmusic.bandcamp.com/",
];
