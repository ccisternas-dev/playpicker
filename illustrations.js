// Decorative SVG artwork; no activity text or user input is inserted here.
const colors = ["#e58e71", "#eab951", "#8caa7b", "#90b4b6", "#a69abf"];
function illustration(a) {
  let shapes = "";
  if (a.art === "town")
    shapes =
      '<path d="M67 157V91L113 56 158 91V157" fill="#ce9d69"/><path d="M158 157V72L210 36 257 73V157" fill="#e2b77f"/><path d="M65 92L113 52 160 92 M157 75L210 33 260 75" fill="none" stroke="#9d7957" stroke-width="6"/><rect x="98" y="120" width="27" height="37" rx="12" fill="#71816b"/><rect x="182" y="94" width="20" height="25" fill="#fff2c3"/><rect x="221" y="94" width="20" height="25" fill="#fff2c3"/><path d="M209 156v-24h25v24" fill="#bb805c"/><path d="M42 159h244" stroke="#a1aa80" stroke-width="6"/><path d="M267 155v-42" stroke="#778460" stroke-width="4"/><circle cx="267" cy="104" r="18" fill="#96a17d"/>';
  if (a.art === "crown")
    shapes =
      '<path d="M71 117L85 74 115 99 145 56 172 96 206 62 222 98 251 79 248 135Q157 166 71 133Z" fill="#c29e69"/><path d="M74 123Q156 145 250 124" fill="none" stroke="#e5cba0" stroke-width="13"/>' +
      [
        [95, 95, -25],
        [136, 97, 25],
        [179, 102, -20],
        [218, 105, 25],
      ]
        .map(
          ([x, y, r]) =>
            `<ellipse cx="${x}" cy="${y}" rx="13" ry="26" fill="#708863" transform="rotate(${r} ${x} ${y})"/><path d="M${x} ${y - 16}v38" stroke="#a9bb8c" stroke-width="2"/>`,
        )
        .join("") +
      '<circle cx="155" cy="127" r="10" fill="#f3d9bd"/><circle cx="155" cy="127" r="4" fill="#e2ae47"/>';
  if (a.art === "rainbow")
    shapes =
      '<rect x="65" y="28" width="201" height="144" rx="3" fill="#fffcf1" transform="rotate(-7 165 100)"/>' +
      colors
        .map(
          (c, i) =>
            `<path d="M${90 + i * 14} 140 A${75 - i * 14} ${75 - i * 14} 0 0 1 ${240 - i * 14} 140" fill="none" stroke="${c}" stroke-width="13" stroke-linecap="round"/>`,
        )
        .join("") +
      '<rect x="233" y="140" width="44" height="23" rx="7" fill="#ddaa58" transform="rotate(17 250 150)"/>';
  if (a.art === "rocket")
    shapes =
      '<g transform="rotate(27 165 105)"><path d="M141 136V74Q148 41 165 25Q185 43 190 74V136Z" fill="#fff7df"/><path d="M142 76Q149 43 165 25Q183 42 190 76" fill="#d8846b"/><circle cx="165" cy="94" r="13" fill="#8eafb5" stroke="#d4dcd6" stroke-width="5"/><path d="M141 114L121 144H141 M190 114L211 144H190" fill="#87977d"/><path d="M148 142L165 178 184 142" fill="#ebbb57"/><path d="M157 142L165 163 175 142" fill="#e79466"/></g><path d="M67 66h15m-7-7v14 M247 133h15m-7-7v14" stroke="#b1b8be" stroke-width="3"/>';
  if (a.art === "trail")
    shapes =
      '<path d="M48 154Q125 90 173 130T282 83" fill="none" stroke="#fbf2d9" stroke-width="5" stroke-dasharray="6 7"/><rect x="49" y="127" width="70" height="35" rx="12" fill="#8f9e7d" transform="rotate(-12 80 140)"/><rect x="137" y="111" width="62" height="31" rx="10" fill="#d58f75" transform="rotate(10 160 130)"/><path d="M201 102L246 28 292 102Z" fill="#c09c6a"/><path d="M225 102L246 61 270 102Z" fill="#6d806d"/><path d="M84 56l6-14 6 14 15 5-15 6-6 14-6-14-15-6Z" fill="#e5b14f"/>';
  if (a.art === "hotel")
    shapes =
      '<path d="M91 163V68L164 24 236 68V163Z" fill="#b78c60"/><path d="M79 70L164 17 247 70" fill="none" stroke="#7f7657" stroke-width="9"/><rect x="104" y="78" width="119" height="72" fill="#7d7853"/><path d="M163 78v72 M104 114h119" stroke="#d2b382" stroke-width="6"/>' +
      Array.from(
        { length: 8 },
        (_, i) =>
          `<circle cx="${115 + (i % 4) * 12}" cy="${89 + Math.floor(i / 4) * 14}" r="5" fill="#cdb17d"/>`,
      ).join("") +
      '<path d="M177 87l34 16m-34-1 34-18 M113 125l34 17m-34-3 34-18" stroke="#bca174" stroke-width="5"/><path d="M181 125l27 16m-25 0 22-18" stroke="#c8b58c" stroke-width="5"/><path d="M73 165h181" stroke="#8da075" stroke-width="6"/>';
  if (a.art === "shadow")
    shapes =
      '<circle cx="181" cy="94" r="75" fill="#f9efcb"/><path d="M150 132Q129 108 149 86L145 48Q148 30 158 48L169 80 179 40Q187 25 192 44L190 84Q218 94 209 118L218 147H154Z" fill="#8d829a"/><circle cx="192" cy="97" r="3" fill="#f9efcb"/><path d="M48 162L110 126" stroke="#687c75" stroke-width="23"/><path d="M95 117L110 111 124 136 109 144Z" fill="#dda65e"/>';
  if (a.art === "water")
    shapes =
      '<path d="M65 88L88 157Q160 180 237 156L263 88Z" fill="#9fc7c8"/><ellipse cx="164" cy="88" rx="99" ry="27" fill="#e7f4eb"/><ellipse cx="164" cy="94" rx="86" ry="19" fill="#a6ced0"/><path d="M122 81Q129 46 168 62Q155 93 122 81" fill="#91a471"/><path d="M127 80l32-14" stroke="#697e59" stroke-width="2"/><ellipse cx="184" cy="137" rx="21" ry="12" fill="#859ba0"/><path d="M219 81L250 43" stroke="#bf9769" stroke-width="8"/><ellipse cx="216" cy="85" rx="10" ry="17" fill="#bf9769" transform="rotate(39 216 85)"/>';
  if (a.art === "leaves")
    shapes =
      '<rect x="70" y="28" width="181" height="141" rx="3" fill="#fffaf0" transform="rotate(-6 160 100)"/>' +
      [
        [121, 96, -25, "#c39e4b"],
        [180, 92, 20, "#9da57a"],
        [213, 132, 50, "#cd9675"],
      ]
        .map(
          ([x, y, r, c]) =>
            `<g transform="rotate(${r} ${x} ${y})"><path d="M${x} ${y + 31}Q${x - 39} ${y} ${x} ${y - 34}Q${x + 38} ${y} ${x} ${y + 31}" fill="${c}" opacity=".7"/><path d="M${x} ${y - 24}v65m0-26-15-12m15 0 15-12m-15-1-12-10" fill="none" stroke="#fff8e0" stroke-width="2"/></g>`,
        )
        .join("") +
      '<path d="M59 150l31 20" stroke="#c69851" stroke-width="9"/>';
  return `<svg viewBox="0 0 330 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><ellipse cx="165" cy="168" rx="114" ry="9" fill="#526447" opacity=".07"/>${shapes}<circle cx="44" cy="47" r="3" fill="#fffaf0"/><path d="M279 43v12m-6-6h12" stroke="#fffaf0" stroke-width="2"/></svg>`;
}
