export interface Track {
    id?: number,
    user_id?: string,
    url?: string,
    track_name?: string,
    createdDate?: Date,
    folder_id?: number,
    isPlaying?: boolean,
    isLiked?: boolean,
    likes?: number,
    youtube_link?: string,
    thumbnail?: string,
    track_order?: number,
    genre?: string
}
