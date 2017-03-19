package com.meta64.mobile.util;

import java.io.Closeable;

import javax.imageio.ImageReader;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class StreamUtil {
	private static final Logger log = LoggerFactory.getLogger(StreamUtil.class);

	/*
	 * todo-0: need to identify ALL places in the code where this method can be called from and call
	 * it
	 */
	public static void close(Object... objects) {
		for (Object obj : objects) {
			if (obj instanceof Closeable) {
				try {
					((Closeable) obj).close();
				}
				catch (Exception e) {
					e.printStackTrace();
				}
			}

			if (obj instanceof ImageReader) {
				try {
					((ImageReader) obj).dispose();
				}
				catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
	}
}
