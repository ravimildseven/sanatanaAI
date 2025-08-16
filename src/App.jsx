import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Youtube, BookOpen, PlayCircle, Book } from "lucide-react";
import clsx from 'clsx';
import EbookViewer from './components/EbookViewer';
import { YOUTUBE_API_KEY } from './config/keys';

const CHANNEL_ID = "UCwOqIpxhefJOtMqqL7nGwEA"; // Direct channel ID for SanatanaKathaAI
const BRAND = {
  name: "sanatanaAI",
  tagline: "Stories, shlokas, and satsang — powered by AI",
  youtubeChannelUrl: `https://www.youtube.com/@SanatanaKathaAI`,
  contactUrl: "mailto:you@example.com",
};

const SECTIONS = {
  VIDEOS: 'videos',
  STORIES: 'stories'
};

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[''"""–—]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function App() {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeSection, setActiveSection] = useState(SECTIONS.VIDEOS);

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true);
      setError(null);
      try {
        // First, try to get channel uploads playlist
        const channelResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
        );

        if (!channelResponse.ok) {
          throw new Error(`Channel API failed with status ${channelResponse.status}`);
        }

        const channelData = await channelResponse.json();
        if (!channelData.items || channelData.items.length === 0) {
          throw new Error('Channel not found');
        }

        const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

        // Then get the videos from the uploads playlist
        const videosResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=10&key=${YOUTUBE_API_KEY}`
        );

        if (!videosResponse.ok) {
          throw new Error(`Videos API failed with status ${videosResponse.status}`);
        }

        const data = await videosResponse.json();

        if (!data.items || data.items.length === 0) {
          setVideos([]);
          return;
        }

        const items = data.items.map((item) => ({
          videoId: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          description: item.snippet.description || "",
          thumbnail: item.snippet.thumbnails.high?.url || "",
        }));

        setVideos(items);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setError(error.message);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-indigo-600">{BRAND.name}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveSection(SECTIONS.VIDEOS)}
                className={clsx(
                  "px-4 py-2 rounded-md flex items-center space-x-2",
                  activeSection === SECTIONS.VIDEOS ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <PlayCircle size={20} />
                <span>Videos</span>
              </button>
              <button
                onClick={() => setActiveSection(SECTIONS.STORIES)}
                className={clsx(
                  "px-4 py-2 rounded-md flex items-center space-x-2",
                  activeSection === SECTIONS.STORIES ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <Book size={20} />
                <span>Stories</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">{BRAND.tagline}</h2>

        {activeSection === SECTIONS.VIDEOS && (
          <div>
            {loading && (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading videos...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-10">
                <p className="text-red-600">Error loading videos: {error}</p>
              </div>
            )}

            {!loading && !error && videos.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-600">No videos found.</p>
              </div>
            )}

            {!loading && !error && videos.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video, idx) => (
                  <motion.div
                    key={video.videoId}
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.videoId}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{video.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{video.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === SECTIONS.STORIES && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="max-w-4xl mx-auto">
              <EbookViewer />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}