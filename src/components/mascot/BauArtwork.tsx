import type { BauhausMascotExpression } from '../BauhausMascot'

export type FaceExpression = BauhausMascotExpression | 'neutral'
const paper = '#F3EFE6'
const ink = '#1C1C1C'
const red = '#E63329'
const blue = '#21409A'
const yellow = '#F4C20D'

function MascotExpression({ expression }: { expression: FaceExpression }) {
  const relaxed = expression === 'calm' || expression === 'proud'
  return (
    <g data-part="expression" data-expression={expression}>
      <g data-part="eye">
        {relaxed ? (
          <path
            d={expression === 'calm' ? 'M208 146a10 10 0 0 0 20 0' : 'M208 150a10 10 0 0 1 20 0'}
            fill="none"
            stroke={ink}
            strokeWidth="4"
            strokeLinecap="round"
          />
        ) : (
          <>
            <circle cx="218" cy="149" r={expression === 'focused' ? 8 : 10} fill={ink} />
            <circle cx="215" cy="146" r="3" fill="#FFFFFF" />
            {expression === 'curious' && (
              <path
                d="M208 131a15 15 0 0 1 20 0"
                fill="none"
                stroke={ink}
                strokeWidth="3"
                strokeLinecap="round"
              />
            )}
            {expression === 'focused' && (
              <path d="M207 140h22" stroke={ink} strokeWidth="3" strokeLinecap="round" />
            )}
          </>
        )}
      </g>
      <g data-part="mouth">
        {expression === 'happy' || expression === 'playful' ? (
          <g data-part="smile">
            <path d="M171 188h52a26 26 0 0 1-52 0Z" fill={ink} />
            <path d="M186 211a11 11 0 0 1 22 0 26 26 0 0 1-22 0Z" fill={red} />
            {expression === 'playful' && (
              <path
                data-part="tongue"
                d="M187 207h20v13a10 10 0 0 1-20 0Z"
                fill={red}
                stroke={ink}
                strokeWidth="2"
              />
            )}
          </g>
        ) : (
          <path
            data-part="closed-mouth"
            d={expression === 'proud' ? 'M175 197a22 22 0 0 0 35 0' : 'M175 200h35'}
            fill="none"
            stroke={ink}
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}
      </g>
    </g>
  )
}

export function MascotHead({ paper, expression }: { paper: string; expression: FaceExpression }) {
  return (
    <>
      <g data-part="neck">
        <path d="m242 212 73 16-6 27-73-16Z" fill={ink} />
        <path d="m248 236-4 22" stroke={ink} strokeWidth="3" />
        <circle cx="242" cy="265" r="12" fill={yellow} />
        <circle cx="242" cy="265" r="4" fill={ink} />
      </g>

      <g data-part="head" data-expression={expression} transform="rotate(3 265 226)">
        <path d="M243 87a69 69 0 0 1 69 69h-69Z" fill={ink} />
        <circle cx="243" cy="165" r="68" fill={red} />
        <path d="M243 97a68 68 0 0 1 68 68h-68Z" fill={yellow} />
        <path d="M274 114h44v96a44 44 0 0 1-44-44Z" fill={ink} />
        <path d="M274 166h44v44a44 44 0 0 1-44-44Z" fill={blue} />
        <path d="M133 168h110v46h-78a32 32 0 0 1-32-32Z" fill={yellow} />
        <path d="M204 168h39v46Z" fill={paper} />
        <path d="M133 168h24v10a14 14 0 0 1-14 14h-10Z" fill={ink} />
        <MascotExpression expression={expression} />
      </g>
    </>
  )
}

export function StandingArtwork({ expression, paper }: { expression: FaceExpression; paper: string }) {
  return (
    <>
      <g data-part="body-unit">
        <g data-part="far-legs" fill={ink}>
          <path d="M296 307h25v104h-25zM296 411h25v21h-33v-13a8 8 0 0 1 8-8Z" />
          <path d="M508 311h28l26 65-21 39h-26l17-42Z" />
          <path d="M515 411h27v21h-46v-8a13 13 0 0 1 13-13Z" />
        </g>

        <path data-part="tail" d="M536 238a72 72 0 0 0 72-72h28a100 100 0 0 1-100 100Z" fill={yellow} />
        <path d="M608 166h28a100 100 0 0 1-7 37l-26-10a72 72 0 0 0 5-27Z" fill={ink} />

        <g data-part="torso">
          <rect x="292" y="238" width="206" height="106" fill={blue} />
          <path d="M366 238h132v106Z" fill={ink} />
          <path d="M366 238h132v38H404Z" fill={blue} />
          <path d="M344 344h114l-57-38Z" fill={paper} />
        </g>

        <g data-part="haunch">
          <circle cx="498" cy="292" r="66" fill={red} />
          <path d="M498 226a66 66 0 0 1 66 66h-66Z" fill={yellow} />
          <path d="M498 292h66a66 66 0 0 1-66 66Z" fill={blue} />
          <path d="M498 292v66a66 66 0 0 1-66-66Z" fill={ink} />
          <path d="M455 264h43v62Z" fill={yellow} />
          <path d="M498 292h42l-42 42Z" fill={paper} />
        </g>

        <g data-part="near-hind-leg">
          <path d="M478 292h32v72l-32 48h-35l35-54Z" fill={yellow} />
          <path d="m478 358 25 17-25 37h-35Z" fill={red} />
          <path d="M443 410h35v22h-56v-9a13 13 0 0 1 13-13Z" fill={ink} />
        </g>

        <g data-part="shoulder">
          <path d="M250 208h64v96h-64Z" fill={red} />
          <path d="M298 238a64 64 0 0 1 64 64h-64Z" fill={yellow} />
          <path d="M298 238v128a64 64 0 0 1 0-128Z" fill={red} />
          <path d="M298 302h64a64 64 0 0 1-64 64Z" fill={blue} />
        </g>

        <g data-part="near-front-leg">
          <rect x="250" y="302" width="32" height="112" fill={yellow} />
          <path d="M250 302h32v32Z" fill={red} />
          <path d="M250 410h32v22h-54v-9a13 13 0 0 1 13-13Z" fill={ink} />
        </g>
      </g>
      <g data-part="head-unit">
        <MascotHead paper="#F3EFE6" expression={expression} />
      </g>
    </>
  )
}

export function WorkingArtwork({ expression }: { expression: FaceExpression }) {
  return (
    <>
      <g data-part="body-unit">
        <g data-part="tail">
          <path d="M133 351a66 66 0 0 1-66-66H42a91 91 0 0 0 91 91Z" fill={yellow} />
          <path d="M42 285h25a66 66 0 0 0 5 25l-23 10a91 91 0 0 1-7-35Z" fill={ink} />
        </g>

        <g data-part="torso">
          <path d="M221 202h52v162H119Z" fill={paper} />
          <path d="M221 202h52v100h-52Z" fill={red} />
          <path d="M119 364h154V259Z" fill={ink} />
          <path d="M157 302h64v62h-102Z" fill={paper} />
        </g>

        <g data-part="far-paw" fill={ink}>
          <path d="M230 339h29v90h-29Z" />
          <path d="M230 421h45a13 13 0 0 1 13 13v9h-58Z" />
        </g>

        <g data-part="haunch">
          <circle cx="181" cy="356" r="70" fill={red} />
          <path d="M181 286a70 70 0 0 1 70 70h-70Z" fill={yellow} />
          <path d="M111 356h70v70a70 70 0 0 1-70-70Z" fill={ink} />
          <path d="M181 356h70a70 70 0 0 1-70 70Z" fill={paper} />
        </g>

        <g data-part="folded-hind-leg">
          <path d="M159 343h34l40 49-28 25h-41l30-28-35-20Z" fill={yellow} />
          <path d="m194 389 23 18-12 10h-41Z" fill={red} />
          <path d="M164 415h55a20 20 0 0 1 20 20v8h-75Z" fill={ink} />
        </g>

        <g data-part="shoulder">
          <path d="M243 230a49 49 0 0 1 49 49h-49Z" fill={yellow} />
          <path d="M243 230v98a49 49 0 0 1 0-98Z" fill={red} />
          <path d="M243 279h49a49 49 0 0 1-49 49Z" fill={paper} />
        </g>

        <g data-part="laptop">
          <path d="M339 250h124l-33 115H306Z" fill={paper} />
          <path d="M344 258h109l-28 98H316Z" fill={ink} />
          <path d="M376 289h28l-8 28h-28Z" fill={yellow} />
          <path d="M376 289h28l-36 28Z" fill={red} />
          <path d="M278 365h152v12H278Z" fill={paper} />
          <path d="M278 377h152v5H278Z" fill={ink} />
        </g>

        <g data-part="near-front-leg">
          <path d="M246 279h30v56h59v30h-59a30 30 0 0 1-30-30Z" fill={yellow} />
          <path d="M246 279h30v30Z" fill={red} />
          <path d="M326 335h24a13 13 0 0 1 13 13v17h-37Z" fill={ink} />
          <path d="M339 354h16" stroke={paper} strokeWidth="2" />
        </g>

        <g data-part="desk">
          <path d="M266 383h205v10H266Z" fill={yellow} />
          <path d="M288 393h14v50h-14ZM445 393h14v50h-14Z" fill={paper} />
        </g>
      </g>
      <g data-part="head-unit" transform="translate(463 -23) scale(-0.92 0.92)">
        <MascotHead paper={paper} expression={expression} />
      </g>
    </>
  )
}

export function RunningComposition() {
  return (
    <g data-part="composition">
      <circle cx="560" cy="113" r="105" fill={paper} />
      <path d="M88 195h100M115 219h58M136 243h29" stroke={ink} strokeWidth="3" />
    </g>
  )
}

export function RunningArtwork({ expression, backdrop }: { expression: FaceExpression; backdrop: string }) {
  return (
    <>
      <g data-part="body-unit">
        <g data-part="tail">
          <path d="M236 161a63 63 0 0 1-63-63h-25a88 88 0 0 0 88 88Z" fill={yellow} />
          <path d="M148 98h25a63 63 0 0 0 5 25l-23 10a88 88 0 0 1-7-35Z" fill={ink} />
        </g>

        <g data-part="far-legs" fill={ink}>
          <path d="m282 201 21 17-55 36-32 7-8-20 30-8Z" />
          <path d="M209 251h33v20h-49v-4a16 16 0 0 1 16-16Z" />
          <path d="m513 192 23-12 54 41 36 8-6 20-39-7-48-24Z" />
          <path d="M610 236h26a14 14 0 0 1 14 14v8h-40Z" />
        </g>

        <g data-part="torso">
          <rect x="280" y="138" width="240" height="89" fill={blue} />
          <path d="M338 138h172v89Z" fill={ink} />
          <path d="M338 138h172v30H376Z" fill={blue} />
          <path d="M340 227h114l-57-34Z" fill={backdrop} />
        </g>

        <g data-part="haunch">
          <circle cx="280" cy="182" r="58" fill={yellow} />
          <path d="M280 124v58h-58a58 58 0 0 1 58-58Z" fill={paper} />
          <path d="M222 182h58v58a58 58 0 0 1-58-58Z" fill={ink} />
          <path d="M280 182h58a58 58 0 0 1-58 58Z" fill={blue} />
          <path d="M280 151v54l-37-23Z" fill={yellow} />
        </g>

        <g data-part="near-hind-leg">
          <path d="m268 192 29 16-45 51-53 34-15-18 47-36Z" fill={yellow} />
          <path d="m231 239 21 20-53 34-15-18Z" fill={paper} />
          <path d="M188 279h16l15 17h-50v-4a13 13 0 0 1 13-13Z" fill={ink} />
        </g>

        <g data-part="shoulder">
          <path d="M510 108h52v74h-52Z" fill={blue} />
          <circle cx="512" cy="182" r="58" fill={blue} />
          <path d="M512 124a58 58 0 0 1 58 58h-58Z" fill={yellow} />
          <path d="M512 182h58a58 58 0 0 1-58 58Z" fill={paper} />
          <path d="M512 182v58a58 58 0 0 1-58-58Z" fill={ink} />
        </g>

        <g data-part="near-front-leg">
          <path d="m508 204 24-7 31 49-20 39h-26l17-40Z" fill={yellow} />
          <path d="m534 245 29 1-20 39h-26Z" fill={paper} />
          <path d="M517 281h30a13 13 0 0 1 13 13v7h-43Z" fill={ink} />
        </g>
      </g>
      <g data-part="head-unit" transform="translate(759 -51) scale(-0.8 0.8)">
        <MascotHead paper={paper} expression={expression} />
      </g>
    </>
  )
}
