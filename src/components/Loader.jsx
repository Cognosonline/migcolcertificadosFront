import { spiral, lineWobble } from 'ldrs'

spiral.register()
lineWobble.register()



export default function Loader({ color, height, background, load }) {
    return (
        <div style={{
            width: '100%',
            height: height,
            background: background,
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center'

        }}>
        { load == 1?<l-spiral

                size="50"
                speed="0.9"
                color={color}
            ></l-spiral>: load == 2?
            <l-line-wobble
                size="100"
                stroke="5"
                bg-opacity="0.09"
                speed="2.8"
                color="#FFFFFF"
            ></l-line-wobble>:<></>}
        </div>
    );
}