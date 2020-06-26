const util = require('util');
const fs = require('fs');
const exec = util.promisify(require('child_process').exec);
const mediaPath = (file) => 'media/' + file;
const storagePath = (file) => 'storage/' + file;


const qualityToValues = {
    360: { level: '3.0', rate: 600 },
    480: { level: '3.1', rate: 1000 },
    720: { level: '4', rate: 3000 },
    1080: { level: '4.2', rate: 6000 },
}
const runCommand = async (command) => {
    try {
        const { stdout, stderr } = await exec(command);
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);
    } catch (err) {
        console.error(err);
    };
};

const encodingByffmpeg = (inputPath, outputPath, size) => {
    const { rate, level } = qualityToValues[size];

    const command = `
            ffmpeg -i ${inputPath} -c:a copy \
            -vf "scale=-2:${size}" \
            -c:v libx264 -profile:v baseline -level:v ${level} \
            -x264-params scenecut=0:open_gop=0:min-keyint=72:keyint=72 \
            -minrate ${rate}k -maxrate ${rate}k -bufsize ${rate}k -b:v ${rate}k \
            -y ${outputPath}/${size}.mp4
    `

    return runCommand(command);
}


const packageVideo = (dir) => {
    const command =
        `packager \
        'in=${dir}/480.mp4,stream=audio,segment_template=${dir}/audio/$Number$.aac,playlist_name=${dir}/audio/main.m3u8,hls_group_id=audio,hls_name=ENGLISH' \
        'in=${dir}/480.mp4,stream=video,segment_template=${dir}/480/$Number$.ts,playlist_name=${dir}/480/main.m3u8,iframe_playlist_name=${dir}/480/iframe.m3u8' \
        'in=${dir}/720.mp4,stream=video,segment_template=${dir}/720/$Number$.ts,playlist_name=${dir}/720/main.m3u8,iframe_playlist_name=${dir}/720/iframe.m3u8' \
        'in=${dir}/1080.mp4,stream=video,segment_template=${dir}/1080/$Number$.ts,playlist_name=${dir}/1080/main.m3u8,iframe_playlist_name=${dir}/1080/iframe.m3u8' \
        --hls_master_playlist_output ${dir}/master.m3u8`;

    return runCommand(command);
}

const createFolder = (path) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
}
const generateThumbnail = (path, outputPath) => {
    createFolder(`${outputPath}/thumb`);
    return runCommand(`ffmpeg -i ${path} -vframes 1 ${outputPath}/thumb/%02d.jpg`);
}

const generateSegment = async (file) => {
    // create folder with file name
    const [folder] = file.split('.');

    // path to save encoded file
    const encodedPath = mediaPath(folder);
    createFolder(encodedPath);
    await generateThumbnail(storagePath(file), encodedPath);
    /*  // encode file
     await encodingByffmpeg(storagePath(file), encodedPath, 480)
     await encodingByffmpeg(storagePath(file), encodedPath, 720);
     await encodingByffmpeg(storagePath(file), encodedPath, 1080);
     // package video
     await packageVideo(encodedPath); */
}


const main = async (file) => {
    await generateSegment(file);
}


main('login.mp4');